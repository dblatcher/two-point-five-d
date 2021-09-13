import { Direction } from './Direction'
import { Position, PositionConfig } from './Position'
import { Game } from './Game'
import { RelativeDirection } from './RelativeDirection'
import { ConvertFunction, mapPointOnFloor, plotPolygon, Point, RelativePoint } from '@/canvas/canvas-utility'
import { RenderInstruction } from '@/canvas/RenderInstruction'
import { Blockage } from './Level'

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

    move(relativeDirection: RelativeDirection, game: Game): Blockage | undefined  {
        return this.moveAbsolute(relativeDirection.getAbsoluteDirection(this.data.direction), game)
    }

    moveBy(distance: number, relativeDirection: RelativeDirection, game: Game): Blockage | undefined  {
        return this.moveAbsoluteBy(distance, relativeDirection.getAbsoluteDirection(this.data.direction), game)
    }

    turn(direction: RelativeDirection): void {
        this.data.direction = direction.getAbsoluteDirection(this.data.direction);
    }

    translateToVantage(vector: PositionConfig): Vantage {
        return new Vantage({ x: this.data.x + vector.x, y: this.data.y + vector.y, direction:this.data.direction });
    }


    get drawInMapPoints(): Point[][] {
        const { direction: d } = this.data;

        const arrowCenter = { x: 0, y: 0 }

        const arrowEnd = {
            x: .4 * d.x,
            y: .4 * d.y,
        }

        const arrowLeft = {
            x: (.3 * d.x) + (.15 * d.leftOf.x),
            y: (.3 * d.y) + (.15 * d.leftOf.y),
        }

        const arrowRight = {
            x: (.3 * d.x) + (.15 * d.rightOf.x),
            y: (.3 * d.y) + (.15 * d.rightOf.y),
        }

        return [[arrowCenter, arrowEnd, arrowLeft, arrowEnd, arrowRight]]
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