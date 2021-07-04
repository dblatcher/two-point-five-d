import { Direction } from "./Direction"
import { RelativePoint } from "../canvas/canvas-utility"

class RelativeDirection {
    name: "LEFT" | "RIGHT" | "FORWARD" | "BACK"
    f: 1 | 0 | -1
    r: 1 | 0 | -1

    constructor(name: "LEFT" | "RIGHT" | "FORWARD" | "BACK", f: 1 | 0 | -1, r: 1 | 0 | -1) {
        this.name = name
        this.f = f
        this.r = r
    }

    getAbsoluteDirection(forwardAbsolute: Direction): Direction {
        switch (this.name) {
            case "FORWARD":
                return forwardAbsolute
            case "BACK":
                return forwardAbsolute.behind
            case "LEFT":
                return forwardAbsolute.leftOf
            case "RIGHT":
                return forwardAbsolute.rightOf
        }
    }

    rotateVector(f: number, r: number): RelativePoint {
        switch (this.name) {
            case "BACK":
                return { f: -f, r: -r }
            case "RIGHT":
                return { f: -r, r: f }
            case "LEFT":
                return { f: r, r: -f }
            case "FORWARD":
            default:
                return { f: f, r: r }
        }
    }

    rotateShape(origin: RelativePoint, vectors: [number, number][]): RelativePoint[] {
        const points: RelativePoint[] = [];
        vectors.forEach(vector => {
            const rotatedVector = this.rotateVector(...vector)
            points.push({ f: origin.f + rotatedVector.f, r: origin.r + rotatedVector.r })
        })
        return points
    }

    static names = ["FORWARD", "BACK", "LEFT", "RIGHT"]
    static get FORWARD(): RelativeDirection { return FORWARD }
    static get BACK(): RelativeDirection { return BACK }
    static get LEFT(): RelativeDirection { return LEFT }
    static get RIGHT(): RelativeDirection { return RIGHT }
}

const FORWARD = new RelativeDirection('FORWARD', 1, 0);
const BACK = new RelativeDirection('BACK', -1, 0);
const LEFT = new RelativeDirection('LEFT', 0, -1);
const RIGHT = new RelativeDirection('RIGHT', 0, 1)

export { RelativeDirection }