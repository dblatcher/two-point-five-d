import { Level } from './Level'
import { Action, InterAction, MovementAction } from './Action'
import { Figure } from './Figure'
import { PointerLocator } from './PointerLocator'
import { Position } from './Position'
import { RelativeDirection } from './RelativeDirection'
import { Item } from './Item'
import { PlayerVantage } from './PlayerVantage'
import { Character } from './Character'
import { Vantage } from './Vantage'
import { SquareWithFeatures } from './SquareWithFeatures'
import { Controller } from './Controller'
import { AbstractFeature } from './AbstractFeature'
import { Color } from '@/canvas/Color'
import { Intersitial } from './Intersitial'
import { NarrativeMessage } from './NarrativeMessage'

interface Movement { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }

interface GameConfig {
    playerVantage: PlayerVantage,
    itemInHand?: Item
    level: Level
    levels: Level[]
    controllers: Controller[]
    characters: Character[]
    activeCharacterIndex: number | undefined
    intersitial?: Intersitial
    gameCompleteMessage?: string
}

interface GameRules {
    needCharacterToPickUpItems?: boolean
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
    rules: GameRules
    queuedPlayerActions: Action[]
    narrativeMessages: NarrativeMessage[]
    tickCount: number
    pointerLocator: PointerLocator

    featuresTriggeredThisTick: AbstractFeature[]

    static MAX_QUEUE_LENGTH: 10

    static CHARACTER_COLORS = [
        Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW
    ]

    constructor(config: GameConfig, rules: GameRules = {}) {
        this.data = config;
        this.rules = rules;
        this.queuedPlayerActions = []
        this.narrativeMessages = []
        this.tickCount = 0
        this.pointerLocator = new PointerLocator;
        this.tick = this.tick.bind(this)

        this.featuresTriggeredThisTick = []

        this.setActiveCharacter(config.activeCharacterIndex);
    }

    get activeCharacter(): Character | null {
        if (typeof this.data.activeCharacterIndex == 'undefined') {
            return null
        }
        return this.data.characters[this.data.activeCharacterIndex] || null
    }

    tick(): void {
        this.tickCount++;
        this.data.level.tickCount = this.tickCount
        this.featuresTriggeredThisTick = []

        const { items, contents, victoryCondition, controllers: levelControllers = [] } = this.data.level.data;

        const allControllers = [...this.data.controllers, ...levelControllers];

        const figures: Figure[] = contents
            .filter(thing => Object.getPrototypeOf(thing).constructor == Figure) // subclasses???!!
            .map(figure => figure as Figure)

        const squaresWithFeatures: SquareWithFeatures[] = contents
            .filter(item => Object.getPrototypeOf(item).constructor == SquareWithFeatures)
            .map(item => item as SquareWithFeatures)

        const nextPlayerAction = this.queuedPlayerActions.shift();
        if (nextPlayerAction) {
            nextPlayerAction.perform(this.data.playerVantage, this);
        }

        figures.forEach(figure => {
            if (figure.data.behaviour) {
                figure.data.behaviour.decideAction(figure, this)?.perform(figure, this)
            }
        })

        items.forEach(item => {
            item.flyThroughAir(this)
        })

        // TODO: make copy of items and figures array that the method can splice from
        // So square don't have to check if things already assigned are on them too
        // althought, that woudl stop two squaresWithFeatures having the same location
        squaresWithFeatures.forEach(square => {
            square.updateThingsOnThisSquare(this.data.playerVantage, figures, items)
        })

        squaresWithFeatures.forEach(square => {
            square.data.floorFeatures.forEach(floorFeature => {
                const weightChange = floorFeature.checkWeightChange(square)

                if (weightChange.hasWeightOnNow !== weightChange.usedToHaveWeightOn) {
                    floorFeature.fireTriggers(this);
                }
            })
        })

        if (this.featuresTriggeredThisTick.length > 0) {
            allControllers.forEach(controller => {
                controller.reactToTriggers(this.featuresTriggeredThisTick)
            })
        }

        allControllers.forEach(controller => {
            controller.reactToInputStatus()
        })

        if (victoryCondition && victoryCondition(this.data.level, this)) {
            this.handleVictory(this.data.level)
        }

    }

    handleVictory(level: Level): void {
        const levelIndex = this.data.levels.indexOf(level);
        const nextLevel = this.data.levels[levelIndex + 1]

        if (nextLevel) {
            this.data.intersitial = new Intersitial({
                role: 'END_OF_LEVEL',
                content: level.data.victoryMessage || 'Level complete.',
                options: [
                    {
                        buttonText: 'Next level',
                        response: Intersitial.goToNextLevel
                    }
                ]
            })
        } else {
            this.data.intersitial = new Intersitial({
                role: 'END_OF_GAME',
                content: this.data.gameCompleteMessage || 'Game complete.',
                options: [
                ]
            })
        }
    }

    handleInterstitialOptionClick(optionIndex: number): FeedbackToUI {
        const { intersitial } = this.data
        if (!intersitial) return FeedbackToUI.no
        if (!intersitial.data.options[optionIndex]) { return FeedbackToUI.no }

        intersitial.data.options[optionIndex].response(this);
        this.data.intersitial = undefined

        return FeedbackToUI.yes
    }


    changeLevel(levelIndex: number, vantage: Vantage): void {
        const { levels, playerVantage } = this.data
        const newLevel = levels[levelIndex];
        if (!newLevel) {
            console.warn(`There is no level ${levelIndex}!`)
            return
        }
        this.data.level = newLevel;
        playerVantage.data.direction = vantage.data.direction
        playerVantage.data.x = vantage.data.x
        playerVantage.data.y = vantage.data.y
    }

    queuePlayerMovementAction(movement: Movement): void {
        if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
            return
        }
        this.queuedPlayerActions.push(new MovementAction(movement.action, RelativeDirection[movement.direction]))
    }

    setActiveCharacter(characterIndex: number | undefined): FeedbackToUI {
        if (typeof characterIndex == 'undefined') {
            this.data.activeCharacterIndex = undefined
            return FeedbackToUI.empty
        } else if (this.data.characters[characterIndex]) {
            this.data.activeCharacterIndex = characterIndex
            return FeedbackToUI.yes
        } else {
            return FeedbackToUI.no
        }
    }

    handleSightClick(clickInfo: { x: number, y: number }): void {
        const { level, playerVantage, itemInHand } = this.data
        const { needCharacterToPickUpItems = false } = this.rules
        const { pointerLocator, activeCharacter } = this
        const { walls, items } = level.data
        const playerHasWallInFace = level.hasWallInFace(playerVantage)
        const squareAheadIsBlocked = level.hasSquareAheadBlocked(playerVantage)
        const locations = pointerLocator.locate(clickInfo, playerHasWallInFace)
        if (locations.length == 0) { return }


        //TO DO - what actions can be done with no active character?

        for (let index = 0; index < locations.length; index++) {
            const location = locations[index];


            // playerHasWallInFace is true even if the wall is an open door
            const itemClicked = this.pointerLocator.identifyClickedItemOnFloor(this.data.playerVantage, items, clickInfo, !squareAheadIsBlocked)

            if (itemClicked) {
                if (!needCharacterToPickUpItems || this.activeCharacter) {
                    if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) { break }
                    this.queuedPlayerActions.push(new InterAction(itemClicked));
                    break
                }
            }


            if (location.type === 'WALL') {
                const wallClicked = pointerLocator.identifyClickedWall(location, walls, playerVantage);
                if (!wallClicked) { continue }
                const isReverseOfWall = wallClicked.reverseSideShowingfrom(this.data.playerVantage)
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

            if (location.type === 'FLOOR') {
                if (location.zone == "FLOOR") {
                    const rotatedLocation = this.pointerLocator.identifyPointOnFloorSquare(location, playerVantage.data.direction);
                    const withinSquareAhead = rotatedLocation.x <= 1 && rotatedLocation.y < 1 && rotatedLocation.x >= 0 && rotatedLocation.y >= 0

                    const positionClicked = new Position({
                        x: playerVantage.data.x + rotatedLocation.x,
                        y: playerVantage.data.y + rotatedLocation.y
                    }).translate(playerVantage.data.direction)

                    if (itemInHand && withinSquareAhead) {
                        itemInHand.placeAt(positionClicked, this.data.playerVantage.data.direction, this);
                        this.data.itemInHand = undefined;
                    }

                }
            }

            if (location.type === 'AIR') {
                if (activeCharacter && itemInHand) {
                    activeCharacter.throw(itemInHand, { x: location.x, y: location.y }, playerVantage, this)
                    this.data.itemInHand = undefined;

                } else if (!needCharacterToPickUpItems && itemInHand) {
                    itemInHand.launch({ x: location.x, y: location.y }, playerVantage, this);
                    this.data.itemInHand = undefined;
                }
            }

        }
    }

    handleInventoryClick(clickInfo: { item: Item, index: number, character?: Character }): FeedbackToUI {
        const { item, index } = clickInfo
        const character = clickInfo.character || this.data.characters[0];
        const { inventory } = character.data
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
        const character = clickInfo.character || this.data.characters[0];
        const { itemInHand } = this.data;
        return character.equip(clickInfo.slotName, itemInHand, this);
    }

    handleSelfClick(clickInfo: { buttonName: string, character?: Character }): FeedbackToUI {
        const character = clickInfo.character || this.data.characters[0];
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