import { plotPolygon } from "@/canvas/canvas-utility";
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

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        plotPolygon(
            ctx, p => [p.x, p.y], 
            this.getDrawInMapPoints(gridSize),
            { noClose: true, noFill:true, strokeStyle:'red' })
    }
}

export { PlayerVantage, PlayerVantageConfig}