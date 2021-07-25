import { Direction } from "./Direction";
import { Vantage } from "./Vantage";

interface PlayerVantageConfig {
    x: number
    y: number
    direction: Direction
}

class PlayerVantage extends Vantage {

    data: PlayerVantageConfig
    constructor(config: PlayerVantageConfig) {
        super(config)
        this.data = config
    }
}

export { PlayerVantage, PlayerVantageConfig}