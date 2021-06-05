import { Vantage } from './Vantage'
import { Level } from './Level'

interface Movement { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }

interface GameConfig {
    playerVantage: Vantage,
    level: Level
}

class Game {
    data: GameConfig
    queuedPlayerActions: Movement[]
    tickCount: number

    static MAX_QUEUE_LENGTH:10 

    constructor(config: GameConfig) {
        this.data = config;
        this.queuedPlayerActions = []
        this.tickCount = 0
        this.tick = this.tick.bind(this)
    }


    tick() {
        this.tickCount++;

        const duckNumberOne = (this.data.level.data.contents[0] as Vantage);
        switch (this.tickCount % 8) {
            case 0:
                duckNumberOne.turn("LEFT");
                break;
            case 2:
                duckNumberOne.move("FORWARD", this);
                break;
            case 6:
                duckNumberOne.turn("LEFT");
                break;
            case 7:
                duckNumberOne.move("FORWARD", this);
                break;
        }

        const nextPlayerAction = this.queuedPlayerActions.shift();
        if (nextPlayerAction) {
            this.movePlayer(nextPlayerAction)
        }
    }

    queuePlayerAction(movement: Movement) {
        if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) { 
            return
        }
        this.queuedPlayerActions.push(movement)
    }

    movePlayer(payload: Movement) {
        switch (payload.action) {
            case "MOVE":
                this.data.playerVantage.move(payload.direction, this)
                break;
            case "TURN":
                this.data.playerVantage.turn(payload.direction)
                break;
        }

    }
}

export { Game, GameConfig }