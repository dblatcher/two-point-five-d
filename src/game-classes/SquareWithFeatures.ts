
import { ConvertFunction } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { PlayerVantage } from "./PlayerVantage";
import { Direction } from "./Direction";
import { Figure } from "./Figure";
import { FloorFeature } from "./FloorFeature";
import { Item } from "./Item";
import { Vantage } from "./Vantage";
import { CeilingFeature } from "./CeilingFeature";
import { Level } from "./Level";


interface SquareWithFeaturesData {
    x: number
    y: number
    direction: Direction
    floorFeatures?: FloorFeature[]
    floorFeatureIds?: string[]
    ceilingFeatures?: CeilingFeature[]
    ceilingFeatureIds?: string[]
}

class SquareWithFeatures extends Vantage {
    data: SquareWithFeaturesData
    vantagesOnThisSquareNow: Vantage[]
    itemsOnThisSquareNow: Item[]
    level?: Level

    constructor(config: SquareWithFeaturesData) {
        super(config)
        this.data = config
        this.vantagesOnThisSquareNow = []
        this.itemsOnThisSquareNow = []
    }

    get isSquareWithFeatures(): boolean { return true }
    get squareX(): number { return .5 }
    get squareY(): number { return .5 }

    getFloorFeatures(): FloorFeature[] {

        const { floorFeatures: directlyReferencedFeatures = [], floorFeatureIds = [] } = this.data
        const allFeatures = [...directlyReferencedFeatures]

        if (this.level) {
            const featuresFromKeys = FloorFeature.getFeatureFromKeyString(floorFeatureIds,FloorFeature, this.level) as FloorFeature[];
            allFeatures.push(...featuresFromKeys)
        }
        return allFeatures
    }

    getCeilingFeatures(): CeilingFeature[] {

        const { ceilingFeatures: directlyReferencedFeatures = [], ceilingFeatureIds = [] } = this.data
        const allFeatures = [...directlyReferencedFeatures]

        if (this.level) {
            const featuresFromKeys = CeilingFeature.getFeatureFromKeyString(ceilingFeatureIds,CeilingFeature, this.level) as CeilingFeature[];
            allFeatures.push(...featuresFromKeys)
        }
        return allFeatures
    }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
        this.getFloorFeatures().forEach(feature => {
            feature.drawInSight(ctx, convertFunction, renderInstruction, tickCount)
        })
        this.getCeilingFeatures().forEach(feature => {
            feature.drawInSight(ctx, convertFunction, renderInstruction, tickCount)
        })
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        const featureToDraw = this.getFloorFeatures().find(feature => feature.isDrawnInMap);

        if (featureToDraw) {
            featureToDraw.drawInMap(ctx, gridSize, this, this.data.direction)
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
                if (item.figure && item.figure.isInSameSquareAs(this)) {
                    this.itemsOnThisSquareNow.push(item)
                }
            })
    }
}

export { SquareWithFeatures, SquareWithFeaturesData }