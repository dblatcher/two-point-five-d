import { Point } from '../canvas/canvas-utility'
import { Position } from './Position'
import { RelativeDirection } from './RelativeDirection'

class Direction {
    name: string
    x: 1 | 0 | -1
    y: 1 | 0 | -1


    constructor(name: string, x: 1 | 0 | -1, y: 1 | 0 | -1) {
        this.name = name
        this.x = x
        this.y = y
    }

    get rightOf(): Direction {
        let answer = nowhere;
        Direction.cardinal.forEach(direction => {
            if (direction.x == -this.y && direction.y == this.x) {
                answer = direction
            }
        })
        return answer;
    }

    get leftOf(): Direction {
        let answer = nowhere;
        Direction.cardinal.forEach(direction => {
            if (direction.x == this.y && direction.y == -this.x) {
                answer = direction
            }
        })
        return answer || null;
    }

    get behind(): Direction {
        let answer = nowhere;
        Direction.cardinal.forEach(direction => {
            if (direction.x == -this.x && direction.y == -this.y) {
                answer = direction
            }
        })
        return answer || null;
    }

    relativeDirection(relativeToDirection: Direction): RelativeDirection {
        if (relativeToDirection.leftOf == this) { return RelativeDirection.LEFT }
        if (relativeToDirection.rightOf == this) { return RelativeDirection.RIGHT }
        if (relativeToDirection.behind == this) { return RelativeDirection.BACK }
        return RelativeDirection.FORWARD
    }

    translatePoint(point: Point, distance: number): Point {
        return {
            x: point.x + (this.x * distance),
            y: point.y + (this.y * distance)
        }
    }

    rotatePoint(point: Point): Point {
        const { x, y } = point;
        switch (this.name) {
            case "NORTH":
                return { x: 1 - y, y: x }
            case "EAST":
                return { x: x, y: y, }
            case "SOUTH":
                return { x: y, y: 1 - x, }
            case "WEST":
                return { x: 1 - x, y: 1 - y, }
            default:
                return { x: 0.5, y: 0.5 }
        }
    }

    rotateSquarePosition(position: Position): Point {
        const { squareX, squareY } = position;
        switch (this.name) {
            case "NORTH":
                return { x: 1 - squareY, y: squareX }
            case "EAST":
                return { x: squareX, y: squareY, }
            case "SOUTH":
                return { x: squareY, y: 1 - squareX, }
            case "WEST":
                return { x: 1 - squareX, y: 1 - squareY, }
            default:
                return { x: 0.5, y: 0.5 }
        }
    }

    getRelativeSquarePosition(position: Position): {forward:number,right:number} {
        const { squareX, squareY } = position;
        switch (this.name) {
            case "NORTH":
                return { forward: 1 - squareY, right: squareX }
            case "EAST":
                return { forward: squareX, right: squareY, }
            case "SOUTH":
                return { forward: squareY, right: 1 - squareX, }
            case "WEST":
                return { forward: 1 - squareX, right: 1 - squareY, }
            default:
                return { forward: 0.5, right: 0.5 }
        }
    }

    static combine(directions: Direction[]):Point {
        let x = 0, y = 0;
        directions.forEach(direction => {
            x += direction.x;
            y += direction.y;
        })
        return { x, y }
    }

    static get cardinal(): Map<string, Direction> {
        const map = new Map();
        map.set("NORTH", NORTH)
        map.set("EAST", EAST)
        map.set("SOUTH", SOUTH)
        map.set("WEST", WEST)
        return map
    }

    static get north() { return NORTH }
    static get south() { return SOUTH }
    static get east() { return EAST }
    static get west() { return WEST }
    static get nowhere() { return nowhere }
}

const nowhere = new Direction("?", 0, 0);
const NORTH = new Direction('NORTH', 0, -1);
const SOUTH = new Direction('SOUTH', 0, 1);
const EAST = new Direction('EAST', 1, 0);
const WEST = new Direction('WEST', -1, 0)

export { Direction }