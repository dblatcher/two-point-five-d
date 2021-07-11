import { ConvertFunction, Dimensions, plotPolygon, Point } from "@/canvas/canvas-utility"
import { getPatternFill, getTextPatternFill } from "@/canvas/patterns"
import { RenderInstruction } from "@/canvas/RenderInstruction"
import { TextBoard } from "@/canvas/TextBoard"
import { Sprite } from "@/canvas/Sprite"
import { Direction } from "./Direction"
import { Game } from "./Game"
import { Reaction } from "./Reaction"
import { RelativeDirection } from "./RelativeDirection"
import { Trigger } from "./Trigger"
import { Vantage } from "./Vantage"

interface WallFeatureConfig {
    sprite?: Sprite
    textBoard?: TextBoard
    animation: string
    id?: string
    triggers?: Trigger[]
    reactions?: Reaction[]
    onBothSides?: boolean
    clipToWall?: boolean
}

class WallFeature {
    data: WallFeatureConfig

    constructor(config: WallFeatureConfig) {
        this.data = config
        this.data.animation = this.data.animation || Sprite.defaultWallAnimation
        this.data.onBothSides == !!config.onBothSides

        const { missingAnimations } = this
        if (missingAnimations.length > 0) { console.warn('Missing animations on WallFeature', this, missingAnimations) }
    }

    get requiredAnimations(): string[] { return this.data.sprite ? [Sprite.defaultWallAnimation] : [] }

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

    get isBlocking(): boolean { return false }
    get canInteract(): boolean { return false }
    get isDrawnInMap(): boolean { return false }

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

    setStatus(animation: string): void {
        if (this.requiredAnimations.includes(animation)) {
            this.data.animation = animation
        } else {
            console.warn(`invalid animation [${animation}] for wall feature`, this)
        }
    }

    handleInteraction(actor: Vantage, game: Game): void {
        this.fireTriggers(game)
        this.fireReactions(actor, game)
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

    drawInMap(place: Direction, squareCenter: Point): Point[][] {
        const edgeMiddle = place.translatePoint(squareCenter, .5);
        const leftCorner = place.leftOf.translatePoint(edgeMiddle, .5);
        const rightCorner = place.rightOf.translatePoint(edgeMiddle, .5);
        const switchEnd = place.behind.translatePoint(edgeMiddle, .15);

        return [
            [rightCorner, edgeMiddle, switchEnd, edgeMiddle, leftCorner]
        ]
    }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number, fullWallPoints: Point[], wallShapePoints: Point[]): void {

        let featureImage: CanvasPattern | null = null;
        if (this.data.sprite) {
            featureImage = getPatternFill(ctx, convertFunction, renderInstruction, tickCount, this.data.sprite, this.data.animation, fullWallPoints);
        }
        if (this.data.textBoard) {
            featureImage = getTextPatternFill(ctx, convertFunction, renderInstruction, this.data.textBoard)
        }
        if (featureImage) {
            plotPolygon(ctx, convertFunction, this.data.clipToWall ? wallShapePoints : fullWallPoints, { noStroke: true, fillStyle: featureImage })
        }
    }
}

class InteractableWallFeature extends WallFeature {
    get canInteract(): boolean { return true }
}

class WallSwitch extends InteractableWallFeature {

    get requiredAnimations(): string[] { return ["OFF", "ON"] }
    get isDrawnInMap(): boolean { return true }

    handleInteraction(actor: Vantage, game: Game): void {
        if (this.data.animation === "OFF") {
            this.setStatus("ON");
        } else {
            this.setStatus("OFF");
        }

        WallFeature.prototype.handleInteraction.apply(this, [actor, game]);
    }
}


interface DoorConfig {
    sprite: Sprite
    animation: string
    id?: string
    triggers?: Trigger[]
    canOpenDirectly?: boolean
    onBothSides?: boolean
}

class Door extends InteractableWallFeature {
    data: DoorConfig

    constructor(config: DoorConfig) {
        super(config)
        this.data = config
        if (typeof config.onBothSides == 'undefined') { this.data.onBothSides = true }
    }

    get requiredAnimations(): string[] { return ["OPEN", "CLOSED"] }

    get canInteract(): boolean { return this.data.animation === "CLOSED" }
    get isBlocking(): boolean { return this.data.animation === "CLOSED" }
    get isDrawnInMap(): boolean { return true }

    handleInteraction(actor: Vantage, game: Game): void {

        if (this.data.canOpenDirectly) {
            if (this.data.animation === "OPEN") {
                this.setStatus("CLOSED");
            } else {
                this.setStatus("OPEN");
            }
        }
        WallFeature.prototype.handleInteraction.apply(this, [actor, game]);
    }

    drawInMap(place: Direction, squareCenter: Point): Point[][] {

        const edge = place.translatePoint(squareCenter, .5);
        const leftCorner = place.leftOf.translatePoint(edge, .5);
        const rightCorner = place.rightOf.translatePoint(edge, .5);
        const leftMiddle = place.leftOf.translatePoint(edge, .25);
        const rightMiddle = place.rightOf.translatePoint(edge, .25);
        const rightMiddleBack = place.translatePoint(rightMiddle, .1);
        const leftMiddleBack = place.translatePoint(leftMiddle, .1);

        if (this.isBlocking) {
            return [
                [rightCorner, leftCorner, leftMiddle, leftMiddleBack, rightMiddleBack, rightMiddle, rightCorner]
            ]
        } else {
            return [
                [leftCorner, leftMiddle, leftMiddleBack,],
                [rightMiddleBack, rightMiddle, rightCorner],
            ]
        }
    }

}

export { WallFeature, InteractableWallFeature, WallSwitch, Door }

