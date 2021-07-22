import { Level } from './Level'
import { Action, InterAction, MovementAction } from './Action'
import { Figure } from './Figure'
import { PointerLocator } from './PointerLocator'
import { Position } from './Position'
import { RelativeDirection } from './RelativeDirection'
import { Item } from './Item'
import { Character } from './Character'
import { Vantage } from './Vantage'
import { SquareWithFeatures } from './SquareWithFeatures'

interface Movement { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }

interface GameConfig {
    playerCharacter: Character,
    itemInHand?: Item
    level: Level
    levels: Level[]
}

class FeedbackToUI {
    message?: string
    propertyList?: [string, string | number][]
    success?: boolean

    constructor(input: {
        message?: string
        propertyList?: [string, string | number][]
        success?: boolean
    }) {
        this.message = input.message
        this.propertyList = input.propertyList
        this.success = input.success
    }

    get isEmpty(): boolean {
        return !this.message && !this.propertyList
    }

    static get empty(): FeedbackToUI { return new FeedbackToUI({}) }
    static get yes(): FeedbackToUI { return new FeedbackToUI({ success: true }) }
    static get no(): FeedbackToUI { return new FeedbackToUI({ success: false }) }
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

        const figures: Figure[] = this.data.level.data.contents
            .filter(item => Object.getPrototypeOf(item).constructor == Figure) // subclasses???!!
            .map(item => item as Figure)

        const squaresWithFeatures: SquareWithFeatures[] = this.data.level.data.contents
            .filter(item => Object.getPrototypeOf(item).constructor == SquareWithFeatures)
            .map(item => item as SquareWithFeatures)

        const nextPlayerAction = this.queuedPlayerActions.shift();
        if (nextPlayerAction) {
            nextPlayerAction.perform(this.data.playerCharacter, this);
        }

        figures.forEach(figure => {
            if (figure.data.behaviour) {
                figure.data.behaviour.decideAction(figure, this)?.perform(figure, this)
            }
        })


        // make this a method of SquaresWithFeature ?
        squaresWithFeatures.forEach(square => {
            square.vantagesOnThisSquareNow = []
            square.itemsOnThisSquareNow = []

            if (this.data.playerCharacter.isInSameSquareAs(square)) {
                square.vantagesOnThisSquareNow.push(this.data.playerCharacter)
            }

            figures.forEach(figure => {
                if (figure.isInSameSquareAs(square)) {
                    square.vantagesOnThisSquareNow.push(figure)
                }
            })

            this.data.level.data.items.forEach(item => {
                if (item.figure && item.figure.isInSameSquareAs(square)) {
                    square.itemsOnThisSquareNow.push(item)
                }
            })
        })

        squaresWithFeatures.forEach(square => {
            square.data.floorFeatures.forEach(floorFeature => {
                const { triggers = [] } = floorFeature.data
                const weightChange = floorFeature.checkWeightChange(square)

                if (weightChange.hasWeightOnNow !== weightChange.usedToHaveWeightOn) {
                    triggers.forEach(trigger => trigger.fire(floorFeature, this))
                }
            })
        })
    }

    changeLevel(levelIndex: number, vantage: Vantage): void {
        const { levels, playerCharacter } = this.data
        const newLevel = levels[levelIndex];
        if (!newLevel) {
            console.warn(`There is no level ${levelIndex}!`)
            return
        }
        this.data.level = newLevel;
        playerCharacter.data.direction = vantage.data.direction
        playerCharacter.data.x = vantage.data.x
        playerCharacter.data.y = vantage.data.y
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

    handleInventoryClick(item: Item, index: number): FeedbackToUI {
        const { inventory } = this.data.playerCharacter.data
        const { itemInHand } = this.data

        if (item) {
            if (itemInHand) {
                inventory.splice(index, 1, itemInHand)
                this.data.itemInHand = item
            } else {
                item.takeIntoHand(inventory, this, true)
            }
            return FeedbackToUI.yes
        }
        else {
            if (itemInHand) {
                inventory.splice(index, 1, itemInHand)
                this.data.itemInHand = undefined
                return FeedbackToUI.yes
            }
        }
        return FeedbackToUI.empty
    }

    handleEquipSlotClick(clickInfo: { slotName: string, character?: Character }): FeedbackToUI {
        const character = clickInfo.character || this.data.playerCharacter;
        const { itemInHand } = this.data;
        return character.equip(clickInfo.slotName, itemInHand, this);
    }

    handleSelfClick(clickInfo: { buttonName: string, character?: Character }): FeedbackToUI {
        const character = clickInfo.character || this.data.playerCharacter;
        const { itemInHand } = this.data;

        switch (clickInfo.buttonName) {
            case "LOOK":
                if (itemInHand) {
                    return new FeedbackToUI({ propertyList: itemInHand.propertyList })
                }
                break
            case "CONSUME":
                if (itemInHand) {
                    return character.consume(itemInHand, this);
                }
                break
        }
        return FeedbackToUI.empty
    }
}

export { Game, GameConfig, FeedbackToUI }