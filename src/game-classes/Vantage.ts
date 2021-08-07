import { Direction } from './Direction'
import { Position } from './Position'
import { Game } from './Game'
import { RelativeDirection } from './RelativeDirection'
import { ConvertFunction, mapPointOnFloor, plotPolygon, Point, RelativePoint } from '@/canvas/canvas-utility'
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
        plotPolygon(
            ctx, p => [p.x, p.y], 
            this.getDrawInMapPoints(gridSize),
            { noClose: true, noFill:true })
    }

    getDrawInMapPoints(gridSize:number):Point[] {
        const { direction: d } = this.data;
        const { gridX, gridY } = this;

        const arrowCenter: Point = {
            x: (gridX + .5) * gridSize,
            y: (gridY + .5) * gridSize
        }

        const arrowEnd = {
            x: arrowCenter.x + (gridSize * .4 * d.x),
            y: arrowCenter.y + (gridSize * .4 * d.y),
        }

        const arrowLeft = {
            x: arrowCenter.x + (gridSize * .3 * d.x) + (gridSize * .15 * d.leftOf.x),
            y: arrowCenter.y + (gridSize * .3 * d.y) + (gridSize * .15 * d.leftOf.y),
        }

        const arrowRight = {
            x: arrowCenter.x + (gridSize * .3 * d.x) + (gridSize * .15 * d.rightOf.x),
            y: arrowCenter.y + (gridSize * .3 * d.y) + (gridSize * .15 * d.rightOf.y),
        }

        return [arrowCenter,arrowEnd,arrowLeft,arrowEnd,arrowRight]
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

        const shapePoints = relativeDirection.rotateShape(exactPlace, Vantage.defaultMarkerShape).map(corner => mapPointOnFloor(corner.f, corner.r))

        plotPolygon(ctx, convertFunction, shapePoints, Vantage.defaultMarkerPlotConfig)
    }

    static defaultMarkerSize = .2
    static defaultMarkerShape: [number, number][] = [
        [- Vantage.defaultMarkerSize, - Vantage.defaultMarkerSize],
        [- Vantage.defaultMarkerSize, + Vantage.defaultMarkerSize],
        [+ Vantage.defaultMarkerSize, 0],
    ]
    static defaultMarkerPlotConfig = { noFill: true }
}


export { Vantage, VantageConfig }