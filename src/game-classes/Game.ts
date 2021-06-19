import { Vantage } from './Vantage'
import { Level } from './Level'
import { Action } from './Behaviour'
import { Figure } from './Figure'
import { PointerLocator } from './PointerLocator'
import { sprites } from '@/store/sprites'
import { Sprite } from '@/game-classes/Sprite'
import { Position } from './Position'
import { WallFeature } from './WallFeature'

interface Movement { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }

interface GameConfig {
    playerVantage: Vantage,
    level: Level
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
            this.makePlayerAct(nextPlayerAction)
        }

        this.data.level.data.contents
            .filter(item => Object.getPrototypeOf(item).constructor == Figure)
            .forEach(item => {
                const figure = item as Figure;

                if (figure.data.behaviour) {
                    figure.performAction(figure.data.behaviour.decideAction(figure, this), this)
                }
            })
    }

    queuePlayerAction(movement: Movement): void {
        if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
            return
        }
        this.queuedPlayerActions.push(new Action(movement.action, movement.direction))
    }

    handleSightClick(clickInfo: { x: number, y: number }): void {
        const { level, playerVantage } = this.data
        const location = this.pointerLocator.locate(clickInfo, level.hasWallInFace(playerVantage))
        if (!location) { return }

        if (location.zone == "FRONT_WALL") {
            const wallClicked =
                level.data.walls.find(wall => wall.isSamePlaceAs(playerVantage) && wall.isFacing(playerVantage.data.direction)) ||
                level.data.walls.find(wall => wall.isSamePlaceAs(playerVantage.translate(playerVantage.data.direction)) && wall.isFacing(playerVantage.data.direction.behind));


            if (wallClicked) {
                const featureClicked = this.pointerLocator.identifyClickedFeature(location, wallClicked);
                featureClicked?.handleInteraction(this);
            }
        }

        if (location.zone == "FLOOR") {
            level.data.contents.push(new Position({ x: playerVantage.data.x, y: playerVantage.data.y }))
        }

    }

    makePlayerAct(action: Action): void {
        this.data.playerVantage.performAction(action, this)
    }
}

export { Game, GameConfig }