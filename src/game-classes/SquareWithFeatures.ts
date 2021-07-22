
import { ConvertFunction } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { Direction } from "./Direction";
import { FloorFeature } from "./FloorFeature";
import { Item } from "./Item";
import { Position } from "./Position";
import { Vantage } from "./Vantage";


interface SquareWithFeaturesData {
    x: number
    y: number
    floorFeatures: FloorFeature[]
    direction: Direction
}

class SquareWithFeatures extends Vantage {
    data: SquareWithFeaturesData
    vantagesOnThisSquareNow: Vantage[]
    itemsOnThisSquareNow: Item[]

    constructor(config: SquareWithFeaturesData) {
        super(config)
        this.data = config
        this.vantagesOnThisSquareNow = []
        this.itemsOnThisSquareNow = []
    }

    get isSquareWithFeatures(): boolean { return true }
    get squareX(): number { return .5 }
    get squareY(): number { return .5 }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
        this.data.floorFeatures.forEach(feature => {
            feature.drawInSight(ctx, convertFunction, renderInstruction, tickCount)
        })
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        const { floorFeatures = [] } = this.data
        const featureToDraw = floorFeatures.find(feature => feature.isDrawnInMap);

        //TO DO - use getDrawInMapPolygons
        if (featureToDraw) {
            Position.prototype.drawInMap.apply(this, [ctx, gridSize])
        }
    }

}

export { SquareWithFeatures, SquareWithFeaturesData }