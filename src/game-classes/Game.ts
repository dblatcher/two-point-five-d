import { Vantage } from './Vantage'
import { Level } from './Level'
import { Action, Behaviour } from './Behaviour'
import { Figure } from './Figure'

interface Movement { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }

interface GameConfig {
    playerVantage: Vantage,
    level: Level
}

class Game {
    data: GameConfig
    queuedPlayerActions: Action[]
    tickCount: number

    static MAX_QUEUE_LENGTH: 10

    constructor(config: GameConfig) {
        this.data = config;
        this.queuedPlayerActions = []
        this.tickCount = 0
        this.tick = this.tick.bind(this)
    }


    tick() {
        this.tickCount++;
        this.data.level.tickCount = this.tickCount

        const nextPlayerAction = this.queuedPlayerActions.shift();
        if (nextPlayerAction) {
            this.makePlayerAct(nextPlayerAction)
        }

        this.data.level.data.contents
        .filter(item => Object.getPrototypeOf(item).constructor == Figure )
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

    makePlayerAct(action: Action): void {
        this.data.playerVantage.performAction(action, this)
    }
}

export { Game, GameConfig }