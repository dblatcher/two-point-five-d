import { ConvertFunction, Dimensions, plotPolygon, Point } from "@/canvas/canvas-utility"
import { Sprite } from "@/canvas/Sprite"
import { Direction } from "./Direction"
import { Game } from "./Game"
import { Position } from "./Position"
import { Reaction } from "./Reaction"
import { RelativeDirection } from "./RelativeDirection"
import { Trigger } from "./Trigger"
import { Vantage } from "./Vantage"

interface AbstractFeatureData {
    triggers?: Trigger[]
    reactions?: Reaction[]
    blocksByDefault?: boolean
    sprite?: Sprite
    animation?: string
    id?: string
}

class AbstractFeature {
    data: AbstractFeatureData
    constructor(config:AbstractFeatureData) {
        this.data = config
    }
    get isFloorFeature(): boolean { return false }
    get isWallFeature(): boolean { return false }
    get isDrawnInMap(): boolean { return false }
    get isBlocking(): boolean { return !!this.data.blocksByDefault }

    get requiredAnimations(): string[] { return [] }

    get status():string {
        return this.data.animation || Sprite.defaultWallAnimation
    }

    setStatus(animation: string): void {
        if (this.requiredAnimations.includes(animation)) {
            this.data.animation = animation
        } else {
            console.warn(`invalid animation [${animation}] for feature`, this)
        }
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


    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number, position:Position, direction:Direction): void {
        const convert: ConvertFunction = (point: Point): [number, number] => [point.x * gridSize, point.y * gridSize];
        const squareCenter: Point = {
            x: (position.gridX + .5),
            y: (position.gridY + .5)
        }

        this.getDrawInMapPolygons(direction, squareCenter).forEach(polygon => {
            plotPolygon(ctx, convert, polygon, { noClose: true, noFill: true })
        })
    }

    getDrawInMapPolygons(direction: Direction, squareCenter: Point): Point[][] {
        return []
    }


    fireTriggers(game: Game): void {
        const { triggers = [] } = this.data
        triggers.forEach(trigger => {
            trigger.fire(this, game)
        });
    }

    fireReactions(actor: Vantage, game: Game): void {
        const { reactions = [] } = this.data
        reactions.forEach(reaction => {
            reaction.fire(actor, game)
        })
    }
}


export {AbstractFeature, AbstractFeatureData}