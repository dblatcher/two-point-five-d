import { DrawingContext, mapPointOnFloor, PlotConfig, plotPolygon, Point, RelativePoint } from "@/canvas/canvas-utility";
import { Color } from "@/canvas/Color";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { AbstractFeature, AbstractFeatureData, AbstractFeatureInput } from './AbstractFeature';
import { Direction } from "./Direction";
import { Item } from "./Item";
import { Level } from "./Level";
import { buildReaction, Reaction, ReactionConfig } from "./Reaction";
import { RelativeDirection } from "./RelativeDirection";
import { SquareWithFeatures } from "./SquareWithFeatures";
import { Vantage } from "./Vantage";

export interface FloorFeatureData extends AbstractFeatureData { }

export interface FloorFeatureInput extends AbstractFeatureInput { }


export class FloorFeature extends AbstractFeature {
    data: FloorFeatureData
    hadWeightOnItLastTick?: boolean

    constructor(input: FloorFeatureInput) {
        super(input)
        this.data = {
            ...input,
            reactions: input.reactions?.map(buildReaction),
            status: input.status ?? this.defaultStatus
        }
        this.hadWeightOnItLastTick = false
    }

    get isDrawnInMap(): boolean { return true }

    static WEIGHED = "WEIGHED"
    static NOT_WEIGHED = "NOT_WEIGHED"

    /**
     * Check the which of the items or vantages are on the floorFeature's square
     * compare the list with the version stored on the floorFeature last tick
     * (TO DO - newThings should by Items, NPCs or PlayerVantage)
     * 
     * @param square 
     */
    checkWeightChange(square: SquareWithFeatures): {
        usedToHaveWeightOn: boolean
        hasWeightOnNow: boolean
    } {

        const thingsOnMeNow: Array<Item | Vantage> = [
            ...square.itemsOnThisSquareNow,
            ...square.vantagesOnThisSquareNow
        ]

        const hasWeightOnNow = thingsOnMeNow.length != 0
        const usedToHaveWeightOn = !!this.hadWeightOnItLastTick

        this.hadWeightOnItLastTick = hasWeightOnNow;

        return { usedToHaveWeightOn, hasWeightOnNow }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawInSight(
        drawingContext: DrawingContext,
        renderInstruction: RenderInstruction,
        _tickCount: number
    ): void {
        const { ctx, convertFunction } = drawingContext
        const { shapes = [{ shape: Vantage.defaultMarkerShape, plotConfig: Vantage.defaultMarkerPlotConfig }] } = this.data
        const { place, viewedFrom, relativeDirection = RelativeDirection.FORWARD } = renderInstruction

        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(renderInstruction.thing as Vantage);
        const exactPlace: RelativePoint = {
            f: place.forward - 1.5 + rotatedSquarePosition.x,
            r: place.right - .5 + rotatedSquarePosition.y
        }

        shapes?.forEach(({ shape, plotConfig }) => {
            const mappedShape = relativeDirection.rotateShape(exactPlace, shape).map(corner => mapPointOnFloor(corner.f, corner.r))
            plotPolygon(ctx, convertFunction, mappedShape, plotConfig)
        })
    }

    getDrawInMapPolygons(direction: Direction, squareCenter: Point): Point[][] {
        const shape = this.data.shapes?.at(0)?.shape || this.defaultShape
        const points = shape.map(coord => {
            let point = direction.translatePoint(squareCenter, coord[0])
            point = direction.leftOf.translatePoint(point, coord[1])
            return point
        })
        points.push(points[0])
        return [points]
    }

    defaultShape: [number, number][] = [
        [0, -.25], [.25, 0], [0, .25], [-.25, 0]
    ]
}


interface PitData {
    featureType: 'Pit'
    reactions?: Reaction[]
    blocksByDefault?: boolean
    status: "OPEN" | "CLOSED"
    plotConfig?: PlotConfig,
}
export interface PitInput {
    featureType: 'Pit'
    reactions?: ReactionConfig[]
    blocksByDefault?: boolean
    status: "OPEN" | "CLOSED"
    plotConfig?: PlotConfig,
}

export class Pit extends FloorFeature {
    data: PitData
    constructor(input: PitInput) {
        super(input)
        this.data = {
            ...input,
            reactions: input.reactions?.map(buildReaction),
            status: input.status ?? this.defaultStatus
        }
        if (typeof input.blocksByDefault == 'undefined') { this.data.blocksByDefault = true }
    }

    get defaultStatus(): string { return 'OPEN' }
    get isBlocking(): boolean { return this.data.status === 'OPEN' }


    getDrawInMapPolygons(direction: Direction, squareCenter: Point): Point[][] {
        const size = .35;
        const topleft = direction.leftOf.translatePoint(direction.translatePoint(squareCenter, size), size);
        const topMiddle = direction.translatePoint(squareCenter, size);

        const topRight = direction.rightOf.translatePoint(direction.translatePoint(squareCenter, size), size);
        const bottomRight = direction.rightOf.translatePoint(direction.behind.translatePoint(squareCenter, size), size);
        const bottomMiddle = direction.behind.translatePoint(squareCenter, size);
        const bottomleft = direction.leftOf.translatePoint(direction.behind.translatePoint(squareCenter, size), size);

        return [
            [topleft, topMiddle, bottomMiddle, topMiddle, topRight, bottomRight, bottomleft, topleft]
        ]
    }


    getDrawInMapConfig(): PlotConfig {
        return { noClose: true, noFill: this.data.status == "CLOSED", fillStyle: Color.BLACK.css }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawInSight(
        drawingContext: DrawingContext,
        renderInstruction: RenderInstruction,
        _tickCount: number
    ): void {
        const { ctx, convertFunction } = drawingContext
        const { place, viewedFrom, level } = renderInstruction
        const relativeDirection = RelativeDirection.FORWARD
        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(renderInstruction.thing as Vantage);
        const exactPlace: RelativePoint = {
            f: place.forward - 1.5 + rotatedSquarePosition.x,
            r: place.right - .5 + rotatedSquarePosition.y
        }

        const corners = relativeDirection.rotateShape(exactPlace, [
            [.4, -.4],
            [.4, .4],
            [-.4, .4],
            [-.4, -.4],
        ]).map(location => { return mapPointOnFloor(location.f, location.r) })

        const [forwardLeft, forwardRight, backRight, backLeft] = corners;

        const floorColor = level.data.floorColor || Level.defaultFloorColor;

        if (this.data.status === 'CLOSED') {
            plotPolygon(ctx, convertFunction, corners, { strokeStyle: Color.BLACK.css, fillStyle: floorColor.lighter(15).css })
            return
        }

        plotPolygon(ctx, convertFunction, corners, { fillStyle: floorColor.darker(15).css })

        if (forwardLeft.x > backLeft.x) {
            const leftBottom: Point = { x: forwardLeft.x, y: backLeft.y }
            plotPolygon(ctx, convertFunction, [forwardLeft, leftBottom, backLeft],
                { fillStyle: floorColor.darker(35).css }
            )
        }

        if (forwardRight.x < backRight.x) {
            const rightBottom: Point = { x: forwardRight.x, y: backRight.y }
            plotPolygon(ctx, convertFunction, [forwardRight, rightBottom, backRight],
                { fillStyle: floorColor.lighter(15).css }
            )
        }
    }
}


