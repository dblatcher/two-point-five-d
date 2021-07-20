import { ConvertFunction, mapPointOnFloor, plotPolygon, RelativePoint, PlotConfig, Point } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { game } from "@/instances/game";
import { Character } from "./Character";
import { Direction } from "./Direction";
import { Figure } from "./Figure";
import { Item } from "./Item";
import { Level } from "./Level";
import { Reaction } from "./Reaction";
import { RelativeDirection } from "./RelativeDirection";
import { Trigger } from "./Trigger";
import { Vantage } from "./Vantage";


interface FloorFeatureConfig {
    x: number
    y: number
    direction: Direction
    blocksByDefault?: boolean
    shape?: [number, number][]
    plotConfig?: PlotConfig,
    triggers?: Trigger[]
    reactions?: Reaction[]
}


class FloorFeature extends Vantage {
    data: FloorFeatureConfig
    hadWeightOnItLastTick?: boolean
    thingsOnMeLastTick: Array<Item | Figure | Character>

    constructor(config: FloorFeatureConfig) {
        super(config)
        this.data = config
        this.hadWeightOnItLastTick = false
        this.thingsOnMeLastTick = []
    }

    get isFloorFeature(): boolean { return true }
    get isWallFeature(): boolean { return false }
    get squareX(): number { return .5 }
    get squareY(): number { return .5 }
    get isBlocking(): boolean { return !!this.data.blocksByDefault }

    /**
     * Check the which of the contents are on the floorFeature's square
     * compare the list with the version stored on the floorFeature last tick
     * do something if there is a change?
     * (not efficient for every floorFeature to check every item - see note in Game.tick)
     * 
     * @param playerCharacter 
     * @param figures 
     * @param items 
     */
    checkWeightChange(playerCharacter: Character, figures: Figure[], items: Item[]): {
        newThings: Array<Item | Figure | Character>
        usedToHaveWeightOn: boolean
        hasWeightOnNow: boolean
    } {

        const thingsOnMeNow: Array<Item | Figure | Character> = []

        if (playerCharacter.isInSameSquareAs(this)) {
            thingsOnMeNow.push(playerCharacter)
        }

        figures.forEach(figure => {
            if (figure.isInSameSquareAs(this)) {
                thingsOnMeNow.push(figure)
            }
        })

        items.forEach(item => {
            if (item.figure && item.figure.isInSameSquareAs(this)) {
                thingsOnMeNow.push(item)
            }
        })

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

        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(this);
        const exactPlace: RelativePoint = {
            f: place.forward - 1.5 + rotatedSquarePosition.x,
            r: place.right - .5 + rotatedSquarePosition.y
        }

        const shapePoints = relativeDirection.rotateShape(exactPlace, shape).map(corner => mapPointOnFloor(corner.f, corner.r))
        plotPolygon(ctx, convertFunction, shapePoints, plotConfig)
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
        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(this);
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

export { FloorFeature, Pit }