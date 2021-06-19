import { Vantage } from './Vantage'
import { Level } from './Level'
import { Action, InterAction, MovementAction } from './Action'
import { Figure } from './Figure'
import { PointerLocator } from './PointerLocator'
import { Position } from './Position'
import { playerVantage } from '@/store/levels'
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
            nextPlayerAction.perform(playerVantage, this);
        }

        this.data.level.data.contents
            .filter(item => Object.getPrototypeOf(item).constructor == Figure)
            .forEach(item => {
                const figure = item as Figure;

                if (figure.data.behaviour) {
                    figure.data.behaviour.decideAction(figure, this).perform(figure, this)
                }
            })
    }

    queuePlayerMovementAction(movement: Movement): void {
        if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
            return
        }
        this.queuedPlayerActions.push(new MovementAction(movement.action, movement.direction))
    }

    handleSightClick(clickInfo: { x: number, y: number }): void {
        const { level, playerVantage } = this.data
        const location = this.pointerLocator.locate(clickInfo, level.hasWallInFace(playerVantage))
        if (!location) { return }

        let featureClicked: WallFeature | null = null;

        if (location.zone == "FRONT_WALL") {
            const wallClicked =
                level.data.walls.find(wall => wall.isSamePlaceAs(playerVantage) && wall.isFacing(playerVantage.data.direction)) ||
                level.data.walls.find(wall => wall.isSamePlaceAs(playerVantage.translate(playerVantage.data.direction)) && wall.isFacing(playerVantage.data.direction.behind));


            if (wallClicked) {
                featureClicked = this.pointerLocator.identifyClickedFeature(location, wallClicked);
            }
        }

        if (location.zone == "FLOOR") {
            level.data.contents.push(new Position({ x: playerVantage.data.x, y: playerVantage.data.y }))
        }

        if (featureClicked) {
            if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
                return
            }
            this.queuedPlayerActions.push(new InterAction(featureClicked));
        }
    }
}

export { Game, GameConfig }