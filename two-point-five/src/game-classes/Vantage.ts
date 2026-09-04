import { DrawingContext, mapPointOnFloor, plotPolygon, Point, RelativePoint } from '@/canvas/canvas-utility'
import { RenderInstruction } from '@/canvas/RenderInstruction'
import { CardinalDirectionName, Direction } from './Direction'
import { Game } from './Game'
import { Blockage } from './Level'
import { Position, PositionConfig } from './Position'
import { RelativeDirection } from './RelativeDirection'

interface VantageConfig {
    x: number
    y: number
    direction: CardinalDirectionName
}

class Vantage extends Position {
    data: VantageConfig

    constructor(config: VantageConfig) {
        super(config)
        this.data = config
    }

    get isVantage(): boolean { return true }
    get direction() {
        return Direction.of(this.data.direction)
    }

    move(relativeDirection: RelativeDirection, game: Game): Blockage | undefined {
        return this.moveAbsolute(relativeDirection.getAbsoluteDirection(this.direction), game)
    }

    moveBy(distance: number, relativeDirection: RelativeDirection, game: Game): Blockage | undefined {
        return this.moveAbsoluteBy(distance, relativeDirection.getAbsoluteDirection(this.direction), game)
    }

    turn(direction: RelativeDirection): void {
        this.data.direction = direction.getAbsoluteDirection(this.direction).name;
    }

    translateToVantage(vector: PositionConfig): Vantage {
        return new Vantage({ x: this.data.x + vector.x, y: this.data.y + vector.y, direction: this.data.direction });
    }


    get drawInMapPoints(): Point[][] {
        const d = this.direction;
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
    drawInSight(
        drawingContext: DrawingContext,
        renderInstruction: RenderInstruction,
        tickCount: number
    ): void {
        const { place, viewedFrom } = renderInstruction
        const { ctx, convertFunction } = drawingContext
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
