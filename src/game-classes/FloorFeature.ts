import { ConvertFunction, mapPointOnFloor, plotPolygon, RelativePoint, PlotConfig, Point } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { Item } from "./Item";
import { Level } from "./Level";
import { Reaction } from "./Reaction";
import { RelativeDirection } from "./RelativeDirection";
import { SquareWithFeatures } from "./SquareWithFeatures";
import { Vantage } from "./Vantage";


import { AbstractFeature } from './AbstractFeature'
import { Sprite } from "@/canvas/Sprite";
import { Direction } from "./Direction";

interface FloorFeatureConfig {
    reactions?: Reaction[]
    blocksByDefault?: boolean
    sprite?: Sprite
    animation?: string
    id?: string

    shape?: [number, number][]
    plotConfig?: PlotConfig,
}


class FloorFeature extends AbstractFeature {
    data: FloorFeatureConfig
    hadWeightOnItLastTick?: boolean
    thingsOnMeLastTick: Array<Item | Vantage>

    constructor(config: FloorFeatureConfig) {
        super(config)
        this.data = config
        this.hadWeightOnItLastTick = false
        this.thingsOnMeLastTick = []
    }

    get isFloorFeature(): boolean { return true }
    get isDrawnInMap(): boolean { return true }

    get status():string {
        return this.hadWeightOnItLastTick ? "WEIGHED" : "NOT_WEIGHED";
    }

    /**
     * Check the which of the contents are on the floorFeature's square
     * compare the list with the version stored on the floorFeature last tick
     * do something if there is a change?
     * 
     * @param square 
     */
    checkWeightChange(square: SquareWithFeatures): {
        newThings: Array<Item | Vantage>
        usedToHaveWeightOn: boolean
        hasWeightOnNow: boolean
    } {

        const thingsOnMeNow: Array<Item | Vantage> = [
            ...square.itemsOnThisSquareNow,
            ...square.vantagesOnThisSquareNow
        ]

        const hasWeightOnNow = thingsOnMeNow.length != 0
        const newThings = thingsOnMeNow.filter(thing => !this.thingsOnMeLastTick.includes(thing))
        const usedToHaveWeightOn = !!this.hadWeightOnItLastTick

        this.hadWeightOnItLastTick = hasWeightOnNow;
        this.thingsOnMeLastTick = thingsOnMeNow

        return { newThings, usedToHaveWeightOn, hasWeightOnNow }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
        const { shape = Vantage.defaultMarkerShape, plotConfig = Vantage.defaultMarkerPlotConfig } = this.data
        const { place, viewedFrom, relativeDirection = RelativeDirection.FORWARD } = renderInstruction

        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(renderInstruction.thing as Vantage);
        const exactPlace: RelativePoint = {
            f: place.forward - 1.5 + rotatedSquarePosition.x,
            r: place.right - .5 + rotatedSquarePosition.y
        }

        const shapePoints = relativeDirection.rotateShape(exactPlace, shape).map(corner => mapPointOnFloor(corner.f, corner.r))
        plotPolygon(ctx, convertFunction, shapePoints, plotConfig)
    }

    getDrawInMapPolygons(direction: Direction, squareCenter: Point): Point[][] {

        const topMiddle = direction.translatePoint(squareCenter, .25);
        const leftMiddle = direction.leftOf.translatePoint(squareCenter, .25);
        const bottomMiddle = direction.behind.translatePoint(squareCenter, .25);
        const rightMiddle = direction.rightOf.translatePoint(squareCenter, .25);

        return [
            [topMiddle,leftMiddle,bottomMiddle, rightMiddle, topMiddle]
        ]
    }


}

class Pit extends FloorFeature {
    constructor(config: FloorFeatureConfig) {
        super(config)
        this.data = config
        if (typeof config.blocksByDefault == 'undefined') { this.data.blocksByDefault = true }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
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

        plotPolygon(ctx, convertFunction, corners, { fillStyle: floorColor.darker(5).css })

        if (forwardLeft.x > backLeft.x) {
            const leftBottom: Point = { x: forwardLeft.x, y: backLeft.y }
            plotPolygon(ctx, convertFunction, [forwardLeft, leftBottom, backLeft],
                { fillStyle: floorColor.darker(25).css }
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

export { FloorFeature, FloorFeatureConfig, Pit }