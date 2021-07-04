import { ConvertFunction, mapPointOnFloor, plotPolygon, RelativePoint, PlotConfig } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { Direction } from "./Direction";
import { RelativeDirection } from "./RelativeDirection";
import { Vantage } from "./Vantage";


interface FloorFeatureConfig {
    x: number
    y: number
    direction: Direction
    blocksByDefault?: boolean
    shape?: [number, number][]
    plotConfig?: PlotConfig,
}


class FloorFeature extends Vantage {
    data: FloorFeatureConfig

    constructor(config: FloorFeatureConfig) {
        super(config)
        this.data = config
    }

    get isFloorFeature(): boolean { return true }
    get squareX(): number { return .5 }
    get squareY(): number { return .5 }
    get isBlocking(): boolean { return !!this.data.blocksByDefault }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
        const { shape = Vantage.defaultMarkerShape, plotConfig = Vantage.defaultMarkerPlotConfig } = this.data
        const { place, viewedFrom, relativeDirection = RelativeDirection.FORWARD } = renderInstruction

        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(this);
        const exactPlace: RelativePoint = {
            f: place.forward - 1.5 + rotatedSquarePosition.x,
            r: place.right - .5 + rotatedSquarePosition.y
        }

        const shapePoints = relativeDirection.rotateShape(exactPlace, shape).map(corner => mapPointOnFloor(corner.f, corner.r))
        plotPolygon(ctx, convertFunction, shapePoints, plotConfig)
    }

}

export { FloorFeature }