import { ConvertFunction, Dimensions, PlotConfig, plotPolygon, Point } from "@/canvas/canvas-utility"
import { Sprite } from "@/canvas/Sprite"
import { Direction } from "./Direction"
import { Game } from "./Game"
import { ItemType } from "./ItemType"
import { Position } from "./Position"
import { Reaction } from "./Reaction"
import { RelativeDirection } from "./RelativeDirection"
import { Vantage } from "./Vantage"

interface AbstractFeatureData {
    reactions?: Reaction[]
    blocksByDefault?: boolean
    sprite?: Sprite

    status?: string

    requiresItem?: ItemType
    consumesItem?: boolean
}

class AbstractFeature {
    data: AbstractFeatureData
    constructor(config: AbstractFeatureData) {
        this.data = config

        this.data.status = config.status || this.defaultStatus
    }
    get defaultStatus(): string { return 'NEUTRAL' }
    get isFloorFeature(): boolean { return false }
    get isWallFeature(): boolean { return false }
    get isDrawnInMap(): boolean { return false }
    get isBlocking(): boolean { return !!this.data.blocksByDefault }

    get requiredAnimations(): string[] { return [] }

    get animation(): string {
        const { status } = this.data
        if (!this.data.sprite) { return "" }


        const { keyArray } = this.data.sprite;

        if (status && keyArray.some(key => key.indexOf(status) == 0)) {
            return status
        }

        return this.defaultStatus
    }

    get missingAnimations(): string[] {
        if (!this.data.sprite) { return [] }

        const sprite = this.data.sprite as Sprite;
        const missing: string[] = [];

        this.requiredAnimations.forEach(animationName => {
            RelativeDirection.names.forEach(relativeDirection => {
                if (
                    !sprite.animations.has(`${animationName}_${relativeDirection}`) &&
                    !sprite.animations.has(`${animationName}`)
                ) {
                    missing.push(`${animationName}_${relativeDirection}`)
                }

            })
        })
        return missing
    }

    get size(): Dimensions {
        if (this.data.sprite) {
            return this.data.sprite.size || { x: 1, y: 1 }
        }
        return { x: 1, y: 1 }
    }

    get offset(): Dimensions {
        if (this.data.sprite) {
            return this.data.sprite.offset || { x: .5, y: .5 }
        }
        return { x: .5, y: .5 }
    }


    setStatus(newStatus: string): void {
        this.data.status = newStatus
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number, position: Position, direction: Direction): void {
        const convert: ConvertFunction = (point: Point): [number, number] => [point.x * gridSize, point.y * gridSize];
        const squareCenter: Point = {
            x: (position.gridX + .5),
            y: (position.gridY + .5)
        }

        this.getDrawInMapPolygons(direction, squareCenter).forEach(polygon => {
            plotPolygon(ctx, convert, polygon, this.getDrawInMapConfig())
        })
    }

    getDrawInMapPolygons(direction: Direction, squareCenter: Point): Point[][] {
        return []
    }

    getDrawInMapConfig(): PlotConfig {
        return { noClose: true, noFill: true }
    }

    fireTriggers(game: Game): void {
        const { requiresItem, consumesItem } = this.data
        const { itemInHand } = game.data;
        if (requiresItem) {
            if (requiresItem !== itemInHand?.data.type) {
                console.log(`Do not have ${requiresItem.name}.`)
                return
            }
            if (consumesItem) {
                console.log(`Used up ${requiresItem.name}.`)
                game.data.itemInHand = undefined;
            }
        }
        game.featuresTriggeredThisTick.push(this)
    }

    fireReactions(actor: Vantage, game: Game): void {
        const { reactions = [] } = this.data
        reactions.forEach(reaction => {
            reaction.fire(actor, game)
        })
    }
}


export { AbstractFeature, AbstractFeatureData }