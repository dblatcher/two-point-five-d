import { Direction } from "./game-classes/Direction";
import { Position } from "./game-classes/Position";
import { Vantage } from "./game-classes/Vantage";

interface Point { x: number, y: number }
interface ConvertFunction { (point: Point): [number, number] }

const wall0Height = .8
const wall0Width = .8
const maxViewDistance = 7


function mapPointOnFloor(forwardDistance: number, rightDistance: number): Point {
    const wallHeightAtDistance = wall0Height / (Math.SQRT2 ** forwardDistance);
    const wallWidthAtDistance = wall0Width / (Math.SQRT2 ** forwardDistance);
    const y = .5 + (wallHeightAtDistance / 2)
    const x = .5 + (rightDistance * wallWidthAtDistance)
    return { x, y }
}

function mapPointOnCeiling(forwardDistance: number, rightDistance: number): Point {
    const wallHeightAtDistance = wall0Height / (Math.SQRT2 ** forwardDistance);
    const wallWidthAtDistance = wall0Width / (Math.SQRT2 ** forwardDistance);
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

    const matrix = [
        [
            { forward: 0, right: -1, position: zeroZero.translate(Direction.combine([facing.leftOf])), },
            { forward: 0, right: 0, position: zeroZero.translate(Direction.combine([])) },
            { forward: 0, right: 1, position: zeroZero.translate(Direction.combine([facing.rightOf])), },
        ]
    ]

    for (let index = 0; index < maxViewDistance; index++) {
        matrix.push(matrix[matrix.length - 1].map(item => {
            return {
                forward: item.forward + 1,
                right: item.right,
                position: item.position.translate(facing)
            }
        }))

        const newRow = matrix[matrix.length - 1]
        const leftItem = newRow[0]


        newRow.unshift({
            forward: leftItem.forward,
            right: leftItem.right -1,
            position: leftItem.position.translate(facing.leftOf)
        })

        const rightItem = newRow[newRow.length-1]
        newRow.push({
            forward: rightItem.forward,
            right: rightItem.right +1,
            position: rightItem.position.translate(facing.rightOf)
        })
    }

    return matrix.flat()
}

export { 
    ConvertFunction, Point,
    mapPointOnFloor, getViewportMapFunction, mapPointOnCeiling, plotPolygon, getPlacesInSight, 
    maxViewDistance, wall0Height 
}