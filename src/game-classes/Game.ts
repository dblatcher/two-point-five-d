import { Level } from './Level'
import { Action, InterAction, MovementAction } from './Action'
import { Figure } from './Figure'
import { PointerLocator } from './PointerLocator'
import { Position } from './Position'
import { playerCharacter } from '@/store/levels'
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
            nextPlayerAction.perform(playerCharacter, this);
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
        const { walls, items } = level.data
        const location = this.pointerLocator.locate(clickInfo, level.hasWallInFace(playerCharacter))
        if (!location) { return }

        let wallClicked: Wall | undefined = undefined;
        let featureClicked: WallFeature | null = null;

        if (location.zone == "FRONT_WALL") {
            wallClicked =
                walls.find(wall => wall.isInSameSquareAs(playerCharacter) && wall.isFacing(playerCharacter.data.direction)) ||
                walls.find(wall => wall.isInSameSquareAs(playerCharacter.translate(playerCharacter.data.direction)) && wall.isFacing(playerCharacter.data.direction.behind));
        }

        if (location.zone == "RIGHT_WALL") {
            wallClicked =
                walls.find(wall => wall.isInSameSquareAs(playerCharacter) && wall.isFacing(playerCharacter.data.direction.rightOf)) ||
                walls.find(wall => wall.isInSameSquareAs(playerCharacter.translate(playerCharacter.data.direction.rightOf)) && wall.isFacing(playerCharacter.data.direction.leftOf));
        }

        if (location.zone == "LEFT_WALL") {
            wallClicked =
                walls.find(wall => wall.isInSameSquareAs(playerCharacter) && wall.isFacing(playerCharacter.data.direction.leftOf)) ||
                walls.find(wall => wall.isInSameSquareAs(playerCharacter.translate(playerCharacter.data.direction.leftOf)) && wall.isFacing(playerCharacter.data.direction.rightOf));
        }

        if (wallClicked) {
            featureClicked = this.pointerLocator.identifyClickedFeature(location, wallClicked);
        }

        if (featureClicked && featureClicked.canInteract) {
            if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
                return
            }
            this.queuedPlayerActions.push(new InterAction(featureClicked));
        }

        const itemClicked = this.pointerLocator.identifyClickedItemOnFloor(this.data.playerCharacter, items, clickInfo)


        if (itemClicked) {
            if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
                return
            }
            this.queuedPlayerActions.push(new InterAction(itemClicked));
        }

        if (location.zone == "FLOOR" && !itemClicked) {
            const rotatedLocation = this.pointerLocator.identifyPointOnFloorSquare(location, playerCharacter.data.direction);

            const positionClicked = new Position({
                x: playerCharacter.data.x + rotatedLocation.x,
                y: playerCharacter.data.y + rotatedLocation.y
            }).translate(playerCharacter.data.direction)

            if (itemInHand) {
                itemInHand.placeAt(positionClicked, this.data.playerCharacter.data.direction, this);
                this.data.itemInHand = undefined;
            }

        }
    }

    handleInventoryClick(item:Item, index:number):void {
        const {inventory} = this.data.playerCharacter.data
        const {itemInHand} = this.data

        if (item) {
            if (!itemInHand) {
                item.takeIntoHand(inventory,this,true)
            }
        }
        else {
            if (itemInHand) {
                inventory.splice(index,1,itemInHand)
                this.data.itemInHand = undefined
            }
        }

    }
}

export { Game, GameConfig }