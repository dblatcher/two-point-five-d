import { Level } from './Level'
import { Action, InterAction, MovementAction } from './Action'
import { Figure } from './Figure'
import { PointerLocator } from './PointerLocator'
import { Position } from './Position'
import { WallFeature } from './WallFeature'
import { Wall } from './Wall'
import { RelativeDirection } from './RelativeDirection'
import { Item } from './Item'
import { Character } from './Character'

interface Movement { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }

interface GameConfig {
    playerCharacter: Character,
    level: Level
    itemInHand?: Item
}

class Game {
    data: GameConfig
    queuedPlayerActions: Action[]
    tickCount: number
    pointerLocator: PointerLocator

    static MAX_QUEUE_LENGTH: 10

    constructor(config: GameConfig) {
        this.data = config;
        this.queuedPlayerActions = []
        this.tickCount = 0
        this.pointerLocator = new PointerLocator;
        this.tick = this.tick.bind(this)
    }


    tick(): void {
        this.tickCount++;
        this.data.level.tickCount = this.tickCount

        const nextPlayerAction = this.queuedPlayerActions.shift();
        if (nextPlayerAction) {
            nextPlayerAction.perform(this.data.playerCharacter, this);
        }

        this.data.level.data.contents
            .filter(item => Object.getPrototypeOf(item).constructor == Figure)
            .forEach(item => {
                const figure = item as Figure;

                if (figure.data.behaviour) {
                    figure.data.behaviour.decideAction(figure, this)?.perform(figure, this)
                }
            })
    }

    queuePlayerMovementAction(movement: Movement): void {
        if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
            return
        }
        this.queuedPlayerActions.push(new MovementAction(movement.action, RelativeDirection[movement.direction]))
    }

    handleSightClick(clickInfo: { x: number, y: number }): void {
        const { level, playerCharacter, itemInHand } = this.data
        const { pointerLocator } = this
        const { walls, items } = level.data
        const playerHasWallInFace = level.hasWallInFace(playerCharacter)
        const squareAheadIsBlocked = level.hasSquareAheadBlocked(playerCharacter)
        const locations = pointerLocator.locate(clickInfo, playerHasWallInFace)
        if (locations.length == 0) { return }


        for (let index = 0; index < locations.length; index++) {
            const location = locations[index];

            if (location.type === 'WALL') {
                const wallClicked = pointerLocator.identifyClickedWall(location, walls, playerCharacter);
                if (!wallClicked) { continue }
                const isReverseOfWall = wallClicked.reverseSideShowingfrom(this.data.playerCharacter)
                const featureClicked = this.pointerLocator.identifyClickedFeature(location, wallClicked, isReverseOfWall);

                if (!featureClicked) {
                    if (wallClicked.isBlocking) { break }
                    if (!wallClicked.isBlocking) { continue }
                } else if (!featureClicked.canInteract && !featureClicked.isBlocking) {
                    continue // allow the next zonePoint to be processed
                } else {
                    if (featureClicked.canInteract) {
                        if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) { break }
                        this.queuedPlayerActions.push(new InterAction(featureClicked));
                        break
                    }
                }
            }

            // playerHasWallInFace is true even if the wall is an open door
            const itemClicked = this.pointerLocator.identifyClickedItemOnFloor(this.data.playerCharacter, items, clickInfo, !squareAheadIsBlocked)

            if (itemClicked) {
                if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) { break }
                this.queuedPlayerActions.push(new InterAction(itemClicked));
                break
            }


            if (location.type === 'FLOOR') {
                if (location.zone == "FLOOR") {
                    const rotatedLocation = this.pointerLocator.identifyPointOnFloorSquare(location, playerCharacter.data.direction);
                    const withinSquareAhead = rotatedLocation.x <= 1 && rotatedLocation.y < 1 && rotatedLocation.x >= 0 && rotatedLocation.y >= 0

                    const positionClicked = new Position({
                        x: playerCharacter.data.x + rotatedLocation.x,
                        y: playerCharacter.data.y + rotatedLocation.y
                    }).translate(playerCharacter.data.direction)

                    if (itemInHand && withinSquareAhead) {
                        itemInHand.placeAt(positionClicked, this.data.playerCharacter.data.direction, this);
                        this.data.itemInHand = undefined;
                    }

                }
            }

        }




    }

    handleInventoryClick(item: Item, index: number): void {
        const { inventory } = this.data.playerCharacter.data
        const { itemInHand } = this.data

        if (item) {
            if (!itemInHand) {
                item.takeIntoHand(inventory, this, true)
            }
        }
        else {
            if (itemInHand) {
                inventory.splice(index, 1, itemInHand)
                this.data.itemInHand = undefined
            }
        }

    }
}

export { Game, GameConfig }