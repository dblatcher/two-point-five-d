import { DrawingContext, getMappedPoints, PlotConfig, plotPolygon, Point } from "@/canvas/canvas-utility"
import { getPatternFill, getTextPatternFill } from "@/canvas/patterns"
import { RenderInstruction } from "@/canvas/RenderInstruction"
import { Sprite } from "@/canvas/Sprite"
import { TextBoard, TextBoardInput } from "@/canvas/TextBoard"
import { Actor } from "@/game-classes/Actor"
import { AbstractFeature, AbstractFeatureData, AbstractFeatureInput } from './AbstractFeature'
import { AnimationTransitionInput } from "./AnimationTransition"
import { Direction } from "./Direction"
import { Game } from "./Game"
import { buildReaction } from "./Reaction"
import { RelativeDirection } from "./RelativeDirection"
import { Vantage } from "./Vantage"
import { Color } from "@/canvas/Color"

interface WallFeatureData extends AbstractFeatureData {
    textBoard?: TextBoard
    onBothSides: boolean
    clipToWall?: boolean
    interactable?: boolean
}

export interface WallFeatureInput extends AbstractFeatureInput {
    textBoard?: TextBoardInput
    onBothSides?: boolean
    clipToWall?: boolean
    interactable?: boolean
}

export class WallFeature extends AbstractFeature {
    data: WallFeatureData

    constructor(input: WallFeatureInput) {
        super(input)
        this.data = {
            ...input,
            textBoard: input.textBoard && new TextBoard(input.textBoard),
            reactions: input.reactions?.map(buildReaction),
            status: input.status || this.defaultStatus,
            onBothSides: !!input.onBothSides
        }
    }

    serialise(): WallFeatureInput {
        const { data } = this
        return {
            ...data,
            reactions: data.reactions?.map(reaction => reaction.serialise()),
            textBoard: data.textBoard?.serialise(),
        }
    }

    get requiredAnimations(): string[] { return this.data.spriteId ? [Sprite.defaultWallAnimation] : [] }
    get canInteract(): boolean { return !!this.data.interactable }

    handleInteraction(actor: Vantage | Actor, game: Game): void {
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

    getDrawInMapShapes(): { shape: Point[], plotConfig: PlotConfig }[] {
        return []
    }


    drawInSight(
        drawingContext: DrawingContext,
        renderInstruction: RenderInstruction,
        tickCount: number,
        fullWallPoints: Point[],
        wallShapePoints: Point[]
    ): void {
        const { spriteRecord, spriteSheetMap, convertFunction, ctx } = drawingContext
        const sprite = this.data.spriteId && spriteRecord[this.data.spriteId]
        let featureImage: CanvasPattern | null = null;
        if (sprite) {
            featureImage = getPatternFill(spriteSheetMap, ctx, convertFunction, renderInstruction, tickCount, sprite, this.getAnimation(spriteRecord), fullWallPoints, this.transitionPhase);
        }
        if (this.data.textBoard) {
            featureImage = getTextPatternFill(ctx, convertFunction, renderInstruction, this.data.textBoard)
        }

        if (featureImage) {
            plotPolygon(ctx, convertFunction, this.data.clipToWall ? wallShapePoints : fullWallPoints, { noStroke: true, fillStyle: featureImage })
            return
        }

        const shapes = this.getDrawInMapShapes()
        shapes.forEach(({ shape, plotConfig }) => {
            const { place, relativeDirection = RelativeDirection.BACK } = renderInstruction
            const mappedShape = getMappedPoints(relativeDirection, shape, place);
            plotPolygon(ctx, convertFunction, mappedShape, plotConfig)

        })
    }
}


export type WallSwitchInput = WallFeatureInput & {
    featureType: 'WallSwitch'
}

export class WallSwitch extends WallFeature {

    constructor(input: WallSwitchInput) {
        super(input)
    }
    get canInteract(): boolean { return true }
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


interface DoorData {
    featureType: 'Door'
    spriteId?: string
    status: "OPEN" | "CLOSED"
    canOpenDirectly?: boolean
    onBothSides: boolean
    transitions: AnimationTransitionInput[]
    fillColor?: string
}
export interface DoorInput {
    featureType: 'Door',
    spriteId?: string
    status: "OPEN" | "CLOSED"
    canOpenDirectly?: boolean
    transitions?: AnimationTransitionInput[],
    fillColor?: string
}

export class Door extends WallFeature {
    data: DoorData

    constructor(input: DoorInput) {
        super(input)
        this.data = {
            ...input,
            onBothSides: true,
            transitions: input.transitions ?? [{ startStatus: 'CLOSED', endStatus: 'OPEN', duration: 15 }]
        }
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

    getDrawInMapShapes(): { shape: Point[], plotConfig: PlotConfig }[] {
        const openness = this.transitionPhase ?? (this.data.status === 'OPEN' ? 1 : 0)
        const doorWidth = 0.8 - (openness * .7)
        const fillStyle = this.data.fillColor ?? Color.BLACK.css;
        return [
            {
                shape: [
                    { x: 0.1, y: 0.1 },
                    { x: 0.1, y: 0.4 },
                    { x: 0.1 + doorWidth, y: 0.4 },
                    { x: 0.1 + doorWidth, y: 0.1 },
                ],
                plotConfig: {
                    fillStyle
                },
            },
            {
                shape: [
                    { x: 0.1, y: 0.6 },
                    { x: 0.1, y: 0.8 },
                    { x: 0.1 + doorWidth, y: 0.8 },
                    { x: 0.1 + doorWidth, y: 0.6 },
                ],
                plotConfig: {
                    fillStyle
                },
            },
            {
                shape: [
                    { x: 0.1, y: 0.6 },
                    { x: 0.1, y: 0.4 },
                    { x: Math.max(0.1 + doorWidth - .6, 0.1), y: 0.4 },
                    { x: Math.max(0.1 + doorWidth - .6, 0.1), y: 0.6 },
                ],
                plotConfig: {
                    fillStyle
                },
            },
            {
                shape: [
                    { x: Math.max(0.1 + doorWidth - .2, 0.1), y: 0.4 },
                    { x: Math.max(0.1 + doorWidth - .2, 0.1), y: 0.6 },
                    { x: 0.1 + doorWidth, y: 0.6 },
                    { x: 0.1 + doorWidth, y: 0.4 },
                ],
                plotConfig: {
                    fillStyle
                },
            },
        ]
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

