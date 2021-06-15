import { Point } from '../canvas/canvas-utility'

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

    relativeDirection(relativeToDirection: Direction): "LEFT" | "RIGHT" | "FORWARD" | "BACK" {
        if (relativeToDirection.leftOf == this) { return "LEFT" }
        if (relativeToDirection.rightOf == this) { return "RIGHT" }
        if (relativeToDirection.behind == this) { return "BACK" }
        return "FORWARD"
    }

    translatePoint(point: Point, distance: number): Point {
        return {
            x: point.x + (this.x * distance),
            y: point.y + (this.y * distance)
        }
    }

    static combine(directions: Direction[]) {
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