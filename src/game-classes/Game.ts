import { Vantage } from './Vantage'
import { Level } from './Level'

interface GameConfig {
    playerVantage: Vantage,
    level: Level
}

class Game {
    data: GameConfig

    constructor(config: GameConfig) {
        this.data = config;
        this.tick = this.tick.bind(this)
    }


    tick() {
        (this.data.level.data.contents[0] as Vantage).turn("LEFT");
    }

    movePlayer(payload: { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }) {
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