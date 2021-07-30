
import { ConvertFunction } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { PlayerVantage } from "./PlayerVantage";
import { Direction } from "./Direction";
import { Figure } from "./Figure";
import { FloorFeature } from "./FloorFeature";
import { Item } from "./Item";
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

        const { floorFeatures = [], direction } = this.data
        const featureToDraw = floorFeatures.find(feature => feature.isDrawnInMap);

        if (featureToDraw) {
            featureToDraw.drawInMap(ctx, gridSize, this, direction)
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