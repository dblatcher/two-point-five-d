import { Direction } from './Direction'
import { Position } from './Position'
import { Game } from './Game'
import { RelativeDirection } from './RelativeDirection'

interface VantageConfig {
    x: number
    y: number
    direction: Direction
}

class Vantage extends Position {
    data: VantageConfig

    constructor(config: VantageConfig) {
        super(config)
        this.data = config
    }

    move(relativeDirection: RelativeDirection, game: Game): void {
        this.moveAbsolute(relativeDirection.getAbsoluteDirection(this.data.direction), game)
    }

    turn(direction: RelativeDirection): void {
        this.data.direction = direction.getAbsoluteDirection(this.data.direction);
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        const { x, y, direction: d } = this.data;
        const arrowCenterX = (x + .5) * gridSize
        const arrowCenterY = (y + .5) * gridSize

        let arrowEndX = arrowCenterX,
            arrowEndY = arrowCenterY,
            arrowLeftX = arrowCenterX,
            arrowLeftY = arrowCenterY,
            arrowRightX = arrowCenterX,
            arrowRightY = arrowCenterY;

        arrowEndX += gridSize * .4 * d.x
        arrowEndY += gridSize * .4 * d.y
        arrowLeftX += gridSize * .3 * d.x
        arrowLeftY += gridSize * .3 * d.y
        arrowLeftX += gridSize * .15 * d.leftOf.x
        arrowLeftY += gridSize * .15 * d.leftOf.y
        arrowRightX += gridSize * .3 * d.x
        arrowRightY += gridSize * .3 * d.y
        arrowRightX += gridSize * .1 * d.rightOf.x
        arrowRightY += gridSize * .1 * d.rightOf.y

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