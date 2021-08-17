import { ConvertFunction, plotPolygon, Point } from "@/canvas/canvas-utility"
import { getPatternFill, getTextPatternFill } from "@/canvas/patterns"
import { RenderInstruction } from "@/canvas/RenderInstruction"
import { TextBoard } from "@/canvas/TextBoard"
import { Sprite } from "@/canvas/Sprite"
import { Direction } from "./Direction"
import { Game } from "./Game"
import { Reaction } from "./Reaction"
import { Vantage } from "./Vantage"
import { AbstractFeature } from './AbstractFeature'
import { ItemType } from "./ItemType"
import { AnimationTransition } from "./AnimationTransition"
import { NonPlayerCharacter } from "@/game-classes/NonPlayerCharacter"

interface WallFeatureConfig {
    reactions?: Reaction[]
    blocksByDefault?: boolean
    sprite?: Sprite
    status?: string
    requiresItem?: ItemType,
    consumesItem?: boolean
    textBoard?: TextBoard
    onBothSides?: boolean
    clipToWall?: boolean
    transitions?: AnimationTransition[]
}

class WallFeature extends AbstractFeature {
    data: WallFeatureConfig

    constructor(config: WallFeatureConfig) {
        super(config)
        this.data = config
        this.data.status = config.status || this.defaultStatus
        this.data.onBothSides == !!config.onBothSides

        const { missingAnimations } = this
        if (missingAnimations.length > 0) { console.warn('Missing animations on WallFeature', this, missingAnimations) }
    }

    get requiredAnimations(): string[] { return this.data.sprite ? [Sprite.defaultWallAnimation] : [] }
    get isWallFeature(): boolean { return true }
    get canInteract(): boolean { return false }

    handleInteraction(actor: Vantage|NonPlayerCharacter, game: Game): void {
        this.fireTriggers(game)
        this.fireReactions(actor, game)
    }


    getDrawInMapPolygons(place: Direction, squareCenter: Point): Point[][] {
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
            featureImage = getPatternFill(ctx, convertFunction, renderInstruction, tickCount, this.data.sprite, this.animation, fullWallPoints, this.transitionPhase);
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
    get defaultStatus(): string { return 'OFF' }

    handleInteraction(actor: Vantage, game: Game): void {
        if (this.data.status === "OFF") {
            this.setStatus("ON");
        } else {
            this.setStatus("OFF");
        }

        WallFeature.prototype.handleInteraction.apply(this, [actor, game]);
    }
}


interface DoorConfig {
    sprite: Sprite
    status: "OPEN" | "CLOSED"
    canOpenDirectly?: boolean
    onBothSides?: boolean
    transitions?: AnimationTransition[]
}

class Door extends InteractableWallFeature {
    data: DoorConfig

    constructor(config: DoorConfig) {
        super(config)
        this.data = config
        if (typeof config.onBothSides == 'undefined') { this.data.onBothSides = true }
        this.data.transitions = [new AnimationTransition('CLOSED', 'OPEN', 15)]
    }

    get defaultStatus(): string { return 'OPEN' }
    get requiredAnimations(): string[] { return ["OPEN", "CLOSED"] }
    get canInteract(): boolean { return this.data.status === "CLOSED" }
    get isBlocking(): boolean { return this.data.status === "CLOSED" }
    get isDrawnInMap(): boolean { return true }

    handleInteraction(actor: Vantage, game: Game): void {

        if (this.data.canOpenDirectly) {
            if (this.data.status === "OPEN") {
                this.setStatus("CLOSED");
            } else {
                this.setStatus("OPEN");
            }
        }
        WallFeature.prototype.handleInteraction.apply(this, [actor, game]);
    }

    getDrawInMapPolygons(place: Direction, squareCenter: Point): Point[][] {

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

