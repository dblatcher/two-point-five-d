import { Level, LevelInput } from './Level'
import { Action, InterAction, MovementAction, NpcInterAction } from './Action'
import { Figure } from './Figure'
import { PointerLocator } from './PointerLocator'
import { Position } from './Position'
import { RelativeDirection } from './RelativeDirection'
import { Item } from './Item'
import { PlayerVantage } from './PlayerVantage'
import { Character, CharacterInput } from '../rpg-classes/Character'
import { Vantage, VantageConfig } from './Vantage'
import { Controller, ControllerData } from './Controller'
import { AbstractFeature } from './AbstractFeature'
import { Color } from '@/canvas/Color'
import { Intersitial } from './Intersitial'
import { NarrativeMessage, NarrativeMessageData } from './NarrativeMessage'
import { Actor } from '@/game-classes/Actor'
import { Monster } from '@/rpg-classes/Monster'
import { AttackOption } from '@/rpg-classes/AttackOption'
import { Quest, QuestData } from '@/rpg-classes/Quest'
import { ItemType } from './ItemType'
import { SpriteSheet } from '@/canvas/SpriteSheet'
import { Sprite, SpriteConfig } from '@/canvas/Sprite'
import { FeedbackToUI } from './FeebackToUi'
import { NonEmptyArray } from '@/types'


interface Movement { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }

const ticksPerMinute = 60

interface GameConfig {
    playerVantage: PlayerVantage,
    itemInHand?: Item
    controllers: Controller[]
    characters: Character[]
    quests?: Quest[]
    activeCharacterIndex: number | undefined
    intersitial?: Intersitial
    narrativeMessages: NarrativeMessage[]
    levelIndex: number

    levels: NonEmptyArray<Level>
}

interface GameInputs {
    playerVantage: VantageConfig,
    itemInHand?: string
    controllers: ControllerData[]
    characters: CharacterInput[]
    quests?: QuestData[]
    activeCharacterIndex: number | undefined
    intersitial?: undefined
    narrativeMessages: NarrativeMessageData[]
    levelIndex?: number

    levels: NonEmptyArray<LevelInput>
}

interface GameImmutables {
    spriteSheets: SpriteSheet[]
    sprites: SpriteConfig[]
    itemTypeRecord: Record<string, ItemType>
    gameCompleteMessage?: string
}

interface GameRules {
    needCharacterToPickUpItems?: boolean
    noCharacters?: boolean
    playerBlocksPassage?: boolean
}

interface FigureMap {
    figure: Figure
    subject: Item | Actor
    canInteractWith: boolean
    subjectClass: typeof Item | typeof Actor
}

class Game {
    data: GameConfig
    immutables: GameImmutables
    rules: GameRules

    queuedPlayerActions: Action[]
    tickCount: number
    pointerLocator: PointerLocator
    debugElement?: HTMLElement
    featuresTriggeredThisTick: AbstractFeature[]
    spriteSheetMap: Map<string, SpriteSheet>
    spriteRecord: Record<string, Sprite>

    constructor(
        config: GameInputs,
        immutables: GameImmutables,
        rules: GameRules = {}
    ) {

        this.immutables = immutables
        this.rules = rules;
        this.queuedPlayerActions = []
        this.tickCount = 0
        this.pointerLocator = new PointerLocator;
        this.tick = this.tick.bind(this)

        this.featuresTriggeredThisTick = []
        this.spriteSheetMap = new Map<string, SpriteSheet>()
        immutables.spriteSheets.forEach(sheet => this.spriteSheetMap.set(sheet.id, sheet))

        const spriteRecord = immutables.sprites.reduce((record, nextSpriteConfig) => {
            return {
                ...record,
                [nextSpriteConfig.id]: new Sprite(nextSpriteConfig)
            }
        }, {})
        this.spriteRecord = spriteRecord

        const itemInHand = config.itemInHand && immutables.itemTypeRecord[config.itemInHand] ? Item.ofType(immutables.itemTypeRecord[config.itemInHand]) : undefined

        this.data = {
            ...config,
            playerVantage: new PlayerVantage(config.playerVantage),
            itemInHand,
            levelIndex: config.levelIndex ?? 0,
            characters: config.characters.map(input => new Character(input, immutables.itemTypeRecord)),
            quests: config.quests?.map(data => new Quest(data)),
            controllers: config.controllers.map(data => new Controller(data)),
            narrativeMessages: config.narrativeMessages.map(data => new NarrativeMessage(data)),
            // TO DO - would it improve memory to only instantiate the currentLevel and serialise the data back when changing?
            levels: config.levels.map(data => new Level(data, {
                spriteRecord,
                itemTypeRecord: immutables.itemTypeRecord,
            })) as NonEmptyArray<Level>
        };

        this.setActiveCharacter(config.activeCharacterIndex);
    }

    serialiseData(): GameInputs {
        return {
            ...this.data,
            intersitial: undefined,
            playerVantage: this.data.playerVantage.data,
            itemInHand: this.data.itemInHand?.itemType.id,
            characters: this.data.characters.map(character => character.serialise()),
            quests: this.data.quests?.map(quest => quest.serialise()),
            controllers: this.data.controllers.map(controller => controller.data),
            narrativeMessages: this.data.narrativeMessages.map(message => message.data),
            levels: this.data.levels.map(level => level.serialise()) as NonEmptyArray<LevelInput>
        }
    }

    static MAX_QUEUE_LENGTH: 10

    static CHARACTER_COLORS = [
        Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW
    ]

    async loadImages() {
        return SpriteSheet.loadAll(this.immutables.spriteSheets)
    }

    get currentLevel(): Level {
        const { levels, levelIndex } = this.data
        return levels[levelIndex] ?? levels[0]
    }

    get activeCharacter(): Character | null {
        if (typeof this.data.activeCharacterIndex == 'undefined') {
            return null
        }
        return this.data.characters[this.data.activeCharacterIndex] || null
    }

    set activeCharacter(character: Character | null) {
        if (!character) {
            this.data.activeCharacterIndex = undefined;
            return
        }
        const index = this.data.characters.indexOf(character)
        if (index == -1) {
            this.data.activeCharacterIndex = undefined;
            return
        }
        this.data.activeCharacterIndex = index
    }

    getRandomLivingCharacter(): Character | null {
        const livingCharacters = this.data.characters.filter(character => !character.data.stats.isDead)
        if (livingCharacters.length === 0) { return null }
        return livingCharacters[Math.floor(Math.random() * livingCharacters.length)]
    }

    get figureMaps(): FigureMap[] {
        const { items = [], actors = [] } = this.currentLevel.data
        const output: FigureMap[] = [];
        items.forEach(item => {
            if (item.figure) {
                output.push({ figure: item.figure, subject: item, subjectClass: Item, canInteractWith: true })
            }
        })
        actors.forEach(actor => {
            const figure = actor.figure
            if (figure) {
                output.push({ figure, subject: actor, subjectClass: Actor, canInteractWith: !!actor.data.canInteractWith })
            }
        })
        return output
    }

    renderSight(
        canvas: HTMLCanvasElement,
        viewWidth?: number,
        viewHeight?: number
    ): void {
        const { playerVantage } = this.data;
        this.currentLevel.drawAsSight(
            this.spriteRecord,
            this.spriteSheetMap,
            canvas,
            playerVantage,
            viewWidth,
            viewHeight
        )
    }

    tick(): void {

        if (this.data.intersitial?.data.pausesTime) { return }

        const startTime = Date.now();

        this.tickCount++;
        this.currentLevel.tickCount = this.tickCount
        this.featuresTriggeredThisTick = []

        const {
            walls = [], items = [], squaresWithFeatures = [], actors = [],
            victoryCondition,
            controllers: levelControllers = []
        } = this.currentLevel.data;

        const allControllers = [...this.data.controllers, ...levelControllers];

        const nextPlayerAction = this.queuedPlayerActions.shift();
        if (nextPlayerAction) {
            nextPlayerAction.start(this.data.playerVantage, this);
        }

        actors.forEach(npc => {
            npc.tick(this);
        })

        items.forEach(item => {
            item.flyThroughAir(this)
        })


        //TO DO - use FigureMap
        const npcFigures = actors.flatMap(npc => npc.figure ?? []);

        // TODO: make copy of items and figures array that the method can splice from
        // So square don't have to check if things already assigned are on them too
        // althought, that woudl stop two squaresWithFeatures having the same location
        squaresWithFeatures.forEach(square => {
            square.updateThingsOnThisSquare(this.data.playerVantage, npcFigures, items)
        })

        squaresWithFeatures.forEach(square => {
            square.floorFeatures.forEach(floorFeature => {
                floorFeature.tick(this)
                const weightChange = floorFeature.checkWeightChange(square)

                if (weightChange.hasWeightOnNow !== weightChange.usedToHaveWeightOn) {
                    floorFeature.fireTriggers(this);
                }
            })
        })

        walls.forEach(wall => {
            wall.features.forEach(wallFeature => {
                wallFeature.tick(this)
            })
        })

        if (this.featuresTriggeredThisTick.length > 0) {
            allControllers.forEach(controller => {
                controller.reactToTriggers(this.featuresTriggeredThisTick)
            })
        }

        this.data.narrativeMessages.forEach(message => {
            message.ticksLeft--
        })
        this.data.narrativeMessages = this.data.narrativeMessages.filter(message => message.ticksLeft > 0)

        // TO DO - game over when all characters are dead
        this.data.characters.forEach(character => character.tick(this))

        allControllers.forEach(controller => {
            controller.reactToInputStatus()
        })

        if (victoryCondition && victoryCondition(this.currentLevel, this)) {
            this.handleVictory(this.currentLevel)
        }

        const endTime = Date.now()

        if (this.debugElement) { this.debugElement.innerText = `tick ${this.tickCount}: ${endTime - startTime}ms` }
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
                content: this.immutables.gameCompleteMessage || 'Game complete.',
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
        this.data.levelIndex = levelIndex
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

    createItemInfrontOfPlayer(itemTypeId: string, distanceRightOfCenter = 0, dropHeight = 0): void {
        const itemType = this.immutables.itemTypeRecord[itemTypeId]
        if (!itemType) {
            console.error('no such item', itemTypeId, Object.keys(this.immutables.itemTypeRecord))
            return
        }
        const { playerVantage } = this.data
        const { direction, data: { x, y } } = playerVantage
        const inFrontOfPlayer = {
            x: x + .5 + (.5 * direction.x),
            y: y + .5 + (.5 * direction.y)
        }

        inFrontOfPlayer.x += (distanceRightOfCenter * direction.rightOf.x)
        inFrontOfPlayer.y += (distanceRightOfCenter * direction.rightOf.y)

        this.currentLevel.data.items.push(
            Item.ofType(
                itemType,
                {
                    vantage: { ...inFrontOfPlayer, direction: direction.name },
                    altitude: dropHeight
                }
            )
        )
    }

    handleSightClick(clickInfo: { x: number, y: number }): void {
        const { playerVantage, itemInHand } = this.data
        const level = this.currentLevel
        const { needCharacterToPickUpItems = false } = this.rules
        const { pointerLocator, activeCharacter } = this
        const { walls } = level.data
        const playerHasWallInFace = level.hasWallInFace(playerVantage)
        const squareAheadIsBlocked = level.hasSquareAheadBlockedByWall(playerVantage)
        const locations = pointerLocator.locate(clickInfo, playerHasWallInFace)
        if (locations.length == 0) { return }

        for (let index = 0; index < locations.length; index++) {
            const location = locations[index];


            // playerHasWallInFace is true even if the wall is an open door
            const figureClicked: FigureMap | null = this.pointerLocator.identifyClickedFigure(this.data.playerVantage, this.figureMaps, clickInfo, !squareAheadIsBlocked)

            let itemClicked: Item | null = null;
            let npcClicked: Actor | null = null;
            if (figureClicked) {
                switch (figureClicked.subjectClass) {
                    case Item:
                        itemClicked = figureClicked.subject as Item;
                        break;
                    case Actor:
                        npcClicked = figureClicked.subject as Actor;
                        break
                }
            }
            if (itemClicked) {
                if (!needCharacterToPickUpItems || this.activeCharacter) {
                    if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) { break }
                    this.queuedPlayerActions.push(new InterAction(itemClicked));
                    break
                }
            } else if (npcClicked) {
                if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) { break }
                this.queuedPlayerActions.push(new NpcInterAction(npcClicked));
                break
            }


            if (location.type === 'WALL') {
                const wallClicked = pointerLocator.identifyClickedWall(location, walls, playerVantage);
                if (!wallClicked) { continue }
                const isReverseOfWall = wallClicked.reverseSideShowingfrom(this.data.playerVantage)
                const featureClicked = this.pointerLocator.identifyClickedFeature(location, wallClicked, isReverseOfWall, this.spriteRecord);

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
                    const rotatedLocation = this.pointerLocator.identifyPointOnFloorSquare(location, playerVantage.direction);
                    const withinSquareAhead = rotatedLocation.x <= 1 && rotatedLocation.y < 1 && rotatedLocation.x >= 0 && rotatedLocation.y >= 0

                    const positionClicked = new Position({
                        x: playerVantage.data.x + rotatedLocation.x,
                        y: playerVantage.data.y + rotatedLocation.y
                    }).translate(playerVantage.direction)

                    if (itemInHand && withinSquareAhead) {
                        itemInHand.placeAt(positionClicked, this.data.playerVantage.direction, this);
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

    handleInventoryClick(clickInfo: { item?: Item, index: number, character?: Character }): FeedbackToUI {
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

    handleAttackButton(clickInfo: { character: Character, option: AttackOption }): FeedbackToUI {
        const { character, option } = clickInfo
        const { playerVantage } = this.data
        const level = this.currentLevel
        const squareAheadIsBlocked = level.hasSquareAheadBlockedByWall(playerVantage)
        const { actors = [] } = level.data

        let targetMonster: Monster | null = null

        if (!squareAheadIsBlocked) {
            //to do - attacking walls
            const squareAhead = playerVantage.translate(playerVantage.direction)
            const actorsInTargetSquare = actors.filter(actor => actor.data.vantage?.isInSameSquareAs(squareAhead))
            const monsters = actorsInTargetSquare.filter(actor => {
                return Object.getPrototypeOf(actor).constructor === Monster
            }).map(actor => {
                return actor as Monster
            })

            if (monsters.length > 0) {
                targetMonster = monsters[0]
            }
        }
        return character.attack(targetMonster, option, this);
    }

    addMessage(message: NarrativeMessageData) {
        this.data.narrativeMessages.push(new NarrativeMessage(message))
    }
}

export { Game, GameConfig, FeedbackToUI, FigureMap, ticksPerMinute }