import { ConvertFunction, plotPolygon, RelativePoint, PlotConfig, mapPointOnCeiling } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { RelativeDirection } from "./RelativeDirection";
import { Vantage } from "./Vantage";


import { AbstractFeature } from './AbstractFeature'
import { Sprite } from "@/canvas/Sprite";

interface CeilingFeatureConfig {
    id?: string
    blocksByDefault?: boolean
    sprite?: Sprite
    status?: string
    shape?: [number, number][]
    plotConfig?: PlotConfig,
}


class CeilingFeature extends AbstractFeature {
    data: CeilingFeatureConfig

    constructor(config: CeilingFeatureConfig) {
        super(config)
        this.data = config
        this.data.status = config.status || this.defaultStatus
    }

    get isFloorFeature(): boolean { return false }
    isCeilingFeature = true;
    get isDrawnInMap(): boolean { return false }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
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

    static isSubClassOf(feature: AbstractFeature):boolean {
        return feature.isCeilingFeature
    }
}




export { CeilingFeature, CeilingFeatureConfig }