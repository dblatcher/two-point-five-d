import { DrawingContext, mapPointOnCeiling, PlotConfig, plotPolygon, RelativePoint } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { RelativeDirection } from "./RelativeDirection";
import { Vantage } from "./Vantage";
import { AbstractFeature, AbstractFeatureData, AbstractFeatureInput } from './AbstractFeature';
import { buildReaction } from "./Reaction";

export interface CeilingFeatureData extends AbstractFeatureData {
    shape?: [number, number][]
    plotConfig?: PlotConfig,
}
export interface CeilingFeatureInput extends AbstractFeatureInput {
    shape?: [number, number][]
    plotConfig?: PlotConfig,
}


export class CeilingFeature extends AbstractFeature {
    data: CeilingFeatureData

    constructor(input: CeilingFeatureInput) {
        super(input)
        this.data = {
            ...input,
            status: input.status ?? this.defaultStatus,
            reactions: input.reactions?.map(buildReaction),
        }
    }

    get isDrawnInMap(): boolean { return false }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawInSight(
        drawingContext: DrawingContext,
        renderInstruction: RenderInstruction,
        _tickCount: number
    ): void {
        const { ctx, convertFunction } = drawingContext
        const { shape = this.defaultShape, plotConfig = Vantage.defaultMarkerPlotConfig } = this.data
        const { place, viewedFrom, relativeDirection = RelativeDirection.FORWARD } = renderInstruction

        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(renderInstruction.thing as Vantage);
        const exactPlace: RelativePoint = {
            f: place.forward - 1.5 + rotatedSquarePosition.x,
            r: place.right - .5 + rotatedSquarePosition.y
        }

        const shapePoints = relativeDirection.rotateShape(exactPlace, shape).map(corner => mapPointOnCeiling(corner.f, corner.r))
        plotPolygon(ctx, convertFunction, shapePoints, plotConfig)
    }


    defaultShape: [number, number][] = [
        [-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]
    ]
}

