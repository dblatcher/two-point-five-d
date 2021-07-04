import { Direction } from './Direction'
import { Position } from './Position'
import { Game } from './Game'
import { RelativeDirection } from './RelativeDirection'
import { ConvertFunction, mapPointOnFloor, plotPolygon, RelativePoint } from '@/canvas/canvas-utility'
import { RenderInstruction } from '@/canvas/RenderInstruction'

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

    get isVantage(): boolean { return true }

    move(relativeDirection: RelativeDirection, game: Game): void {
        this.moveAbsolute(relativeDirection.getAbsoluteDirection(this.data.direction), game)
    }

    moveBy(distance: number, relativeDirection: RelativeDirection, game: Game): void {
        this.moveAbsoluteBy(distance, relativeDirection.getAbsoluteDirection(this.data.direction), game)
    }

    turn(direction: RelativeDirection): void {
        this.data.direction = direction.getAbsoluteDirection(this.data.direction);
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        const { direction: d } = this.data;
        const { gridX, gridY } = this;
        const arrowCenterX = (gridX + .5) * gridSize
        const arrowCenterY = (gridY + .5) * gridSize

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
        const { place, viewedFrom } = renderInstruction
        const relativeDirection = renderInstruction.relativeDirection as RelativeDirection;
        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(this);
        const exactPlace: RelativePoint = {
            f: place.forward - 1.5 + rotatedSquarePosition.x,
            r: place.right - .5 + rotatedSquarePosition.y
        }

        const outDistance = .2;

        const shapePoints = relativeDirection.rotateShape(exactPlace, [
            [- outDistance, - outDistance],
            [- outDistance, + outDistance],
            [+ outDistance, 0],
        ]).map(corner => mapPointOnFloor(corner.f, corner.r))

        plotPolygon(ctx, convertFunction, shapePoints, { noFill: true })
    }
}


export { Vantage, VantageConfig }