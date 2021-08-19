import { ConvertFunction, Dimensions, PlotConfig, plotPolygon, Point } from "@/canvas/canvas-utility"
import { Sprite } from "@/canvas/Sprite"
import { Actor } from "@/game-classes/Actor"
import { AnimationTransition } from "./AnimationTransition"
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

    transitions?: AnimationTransition[]
}

class AbstractFeature {
    data: AbstractFeatureData
    transitionTickCount: number | undefined
    transitionReversed: boolean
    transition: AnimationTransition | undefined

    constructor(config: AbstractFeatureData) {
        this.data = config
        this.data.status = config.status || this.defaultStatus

        this.transitionTickCount = undefined
        this.transitionReversed = false
        this.transition = undefined
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

        if (this.transition) {
            const { animationKey } = this.transition
            if (status && keyArray.some(key => key.indexOf(animationKey) != -1)) {
                return animationKey
            }
        }

        if (status && keyArray.some(key => key.indexOf(status) != -1)) {
            return status
        }

        return this.defaultStatus
    }

    get transitionPhase(): number | undefined {
        if (!this.transition) { return undefined }
        return this.transition.getTransitionPhase(this.transitionTickCount || 0, this.transitionReversed)
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

        const oldStatus = this.data.status;
        if (oldStatus == newStatus) { return }

        const transition = this.data.transitions?.find(transition => transition.startStatus == oldStatus && transition.endStatus == newStatus)
        const reversedTransition = this.data.transitions?.find(transition => transition.startStatus == newStatus && transition.endStatus == oldStatus)

        if (transition) {
            if (transition == this.transition) {
                this.transitionTickCount = transition.duration - (this.transitionTickCount || 0)
            } else {
                this.transitionTickCount = 0
            }
            this.transition = transition
            this.transitionReversed = false
        } else if (reversedTransition) {
            if (reversedTransition == this.transition) {
                this.transitionTickCount = reversedTransition.duration - (this.transitionTickCount || 0)
            } else {
                this.transitionTickCount = 0
            }
            this.transition = reversedTransition
            this.transitionReversed = true
        } else {
            this.transitionTickCount = undefined
            this.transition = undefined
            this.transitionReversed = false
        }

        this.data.status = newStatus
    }

    advanceTransition():void {
        if (this.transition) {
            if (typeof this.transitionTickCount == 'undefined') { this.transitionTickCount = -1 }
            this.transitionTickCount++;
            if (this.transitionTickCount > this.transition.duration) {
                this.transition = undefined
                this.transitionTickCount = undefined
            }
        }
    }

    tick(game:Game):void {
        this.advanceTransition()
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

    fireReactions(actor: Vantage|Actor, game: Game): void {
        const { reactions = [] } = this.data
        reactions.forEach(reaction => {
            reaction.fire(actor, game)
        })
    }
}


export { AbstractFeature, AbstractFeatureData }