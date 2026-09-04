
import { DrawingContext } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { CeilingFeature } from "./CeilingFeature";
import { Figure } from "./Figure";
import { FloorFeature } from "./FloorFeature";
import { Item } from "./Item";
import { Level } from "./Level";
import { PlayerVantage } from "./PlayerVantage";
import { Vantage, VantageConfig } from "./Vantage";


type SquareWithFeaturesData = VantageConfig & {
    floorFeatureIds?: string[]
    ceilingFeatureIds?: string[]
}

class SquareWithFeatures extends Vantage {
    data: SquareWithFeaturesData
    vantagesOnThisSquareNow: Vantage[]
    itemsOnThisSquareNow: Item[]
    level?: Level
    ceilingFeatures: CeilingFeature[]
    floorFeatures: FloorFeature[]

    constructor(config: SquareWithFeaturesData) {
        super(config)
        this.data = config
        this.vantagesOnThisSquareNow = []
        this.itemsOnThisSquareNow = []

        this.ceilingFeatures = []
        this.floorFeatures = []
    }

    get isSquareWithFeatures(): boolean { return true }
    get squareX(): number { return .5 }
    get squareY(): number { return .5 }

    getFloorFeatures(): FloorFeature[] {

        const { floorFeatureIds = [] } = this.data
        const allFeatures = []

        if (this.level) {
            const featuresFromKeys = FloorFeature.getFeaturesFromKeyArray(floorFeatureIds, FloorFeature, this.level) as FloorFeature[];
            allFeatures.push(...featuresFromKeys)
        }
        return allFeatures
    }

    getCeilingFeatures(): CeilingFeature[] {

        const { ceilingFeatureIds = [] } = this.data
        const allFeatures = []

        if (this.level) {
            const featuresFromKeys = CeilingFeature.getFeaturesFromKeyArray(ceilingFeatureIds, CeilingFeature, this.level) as CeilingFeature[];
            allFeatures.push(...featuresFromKeys)
        }
        return allFeatures
    }

    drawInSight(
        drawingContext: DrawingContext,
        renderInstruction: RenderInstruction,
        tickCount: number
    ): void {
        this.floorFeatures.forEach(feature => {
            feature.drawInSight(drawingContext, renderInstruction, tickCount)
        })
        this.ceilingFeatures.forEach(feature => {
            feature.drawInSight(drawingContext, renderInstruction, tickCount)
        })
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        const featureToDraw = this.floorFeatures.find(feature => feature.isDrawnInMap);

        if (featureToDraw) {
            featureToDraw.drawInMap(ctx, gridSize, this, this.direction)
        }
    }

    updateThingsOnThisSquare(playerVantage: PlayerVantage, figures: Figure[], items: Item[]): void {
        this.vantagesOnThisSquareNow = []
        this.itemsOnThisSquareNow = []

        if (playerVantage.isInSameSquareAs(this)) {
            this.vantagesOnThisSquareNow.push(playerVantage)
        }

        figures.forEach(figure => {
            if (figure.isInSameSquareAs(this)) {
                this.vantagesOnThisSquareNow.push(figure)
            }
        })

        items.filter(item => !item.data.altitude)
            .forEach(item => {
                if (item.data.vantage && item.data.vantage.isInSameSquareAs(this)) {
                    this.itemsOnThisSquareNow.push(item)
                }
            })
    }
}

export { SquareWithFeatures, SquareWithFeaturesData };

