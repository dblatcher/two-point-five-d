import { Direction } from './Direction'

interface VantageConfig {
    x: number
    y: number
    direction: Direction
}

class Vantage {
    data: VantageConfig

    constructor(config: VantageConfig) {
        this.data = config
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number) {
        const { x, y, direction: d } = this.data;
        const arrowCenterX = (x + .5) * gridSize
        const arrowCenterY = (y + .5) * gridSize

        let arrowEndX = arrowCenterX,
            arrowEndY = arrowCenterY,
            arrowLeftX = arrowCenterX,
            arrowLeftY = arrowCenterY,
            arrowRightX = arrowCenterX,
            arrowRightY = arrowCenterY;

        arrowEndX += gridSize * .5 * d.x
        arrowEndY += gridSize * .5 * d.y
        arrowLeftX += gridSize * .35 * d.x
        arrowLeftY += gridSize * .35 * d.y
        arrowLeftX += gridSize * .15 * d.leftOf.x
        arrowLeftY += gridSize * .15 * d.leftOf.y
        arrowRightX += gridSize * .35 * d.x
        arrowRightY += gridSize * .35 * d.y
        arrowRightX += gridSize * .15 * d.rightOf.x
        arrowRightY += gridSize * .15 * d.rightOf.y

        ctx.beginPath();
        ctx.moveTo(arrowCenterX, arrowCenterY);
        ctx.lineTo(arrowEndX, arrowEndY);
        ctx.lineTo(arrowLeftX, arrowLeftY);
        ctx.lineTo(arrowEndX, arrowEndY);
        ctx.lineTo(arrowRightX, arrowRightY);
        ctx.stroke();
    }
}


export { Vantage, VantageConfig }