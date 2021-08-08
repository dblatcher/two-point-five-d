import { PlotConfig, plotPolygon } from "@/canvas/canvas-utility";
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

    drawInMapConfig:PlotConfig = { noClose: true, noFill:true, strokeStyle:'red' }
}

export { PlayerVantage, PlayerVantageConfig}