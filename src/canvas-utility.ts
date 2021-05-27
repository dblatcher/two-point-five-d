import { Direction } from "./game-classes/Direction";
import { Position } from "./game-classes/Position";
import { Vantage } from "./game-classes/Vantage";

interface Point { x: number, y: number }
interface ConvertFunction { (point: Point): [number, number] }

const wall0Height = .8
const wall0Width = .8
const maxViewDistance = 5


function mapPointOnFloor(forwardDistance: number, rightDistance: number): Point {
    const wallHeightAtDistance = wall0Height / (2 ** forwardDistance);
    const wallWidthAtDistance = wall0Width / (2 ** forwardDistance);
    const y = .5 + (wallHeightAtDistance / 2)
    const x = .5 + (rightDistance * wallWidthAtDistance)
    return { x, y }
}

function mapPointOnCeiling(forwardDistance: number, rightDistance: number): Point {
    const wallHeightAtDistance = wall0Height / (2 ** forwardDistance);
    const wallWidthAtDistance = wall0Width / (2 ** forwardDistance);
    const y = .5 - (wallHeightAtDistance / 2)
    const x = .5 + (rightDistance * wallWidthAtDistance)
    return { x, y }
}


function plotPolygon(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, points: Point[]) {
    ctx.beginPath()
    ctx.moveTo(...convertFunction(points[0]))
    for (let index = 1; index < points.length; index++) {
        ctx.lineTo(...convertFunction(points[index]))
    }
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
}


function getViewportMapFunction(viewWidth: number, viewHeight: number): ConvertFunction {
    return function convertToViewport(point: Point): [number, number] {
        return [point.x * viewWidth, point.y * viewHeight]
    }
}




function getPlacesInSight(vantage: Vantage): { position: Position, forward: number, right: number }[] {
    const zeroZero = new Position(vantage.data)
    const facing = vantage.data.direction;

    const results = [
        { forward: 0, right: -1, position: zeroZero.translate(Direction.combine([facing.leftOf])), },
        { forward: 0, right: 0, position: zeroZero.translate(Direction.combine([])) },
        { forward: 0, right: 1, position: zeroZero.translate(Direction.combine([facing.rightOf])), },


        { forward: 1, right: -1, position: zeroZero.translate(Direction.combine([facing, facing.leftOf])), },
        { forward: 1, right: 0, position: zeroZero.translate(Direction.combine([facing])), },
        { forward: 1, right: 1, position: zeroZero.translate(Direction.combine([facing, facing.rightOf])), },
        
        
        { forward: 2, right: -1, position: zeroZero.translate(Direction.combine([facing, facing, facing.leftOf])), },
        { forward: 2, right: 0, position: zeroZero.translate(Direction.combine([facing, facing])), },
        { forward: 2, right: 1, position: zeroZero.translate(Direction.combine([facing, facing, facing.rightOf])), },

    ]

    return results
}

export { mapPointOnFloor, getViewportMapFunction, mapPointOnCeiling, plotPolygon, getPlacesInSight, maxViewDistance }