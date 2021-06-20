import { Direction } from "./Direction"

class RelativeDirection {
    name: "LEFT" | "RIGHT" | "FORWARD" | "BACK" 
    f: 1 | 0 | -1
    r: 1 | 0 | -1

    constructor(name: "LEFT" | "RIGHT" | "FORWARD" | "BACK" , f: 1 | 0 | -1, r: 1 | 0 | -1) {
        this.name = name
        this.f = f
        this.r = r
    }

    getAbsoluteDirection(forwardAbsolute:Direction) {
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

    static names = ["FORWARD", "BACK", "LEFT", "RIGHT"]
    static get FORWARD() { return FORWARD }
    static get BACK() { return BACK }
    static get LEFT() { return LEFT }
    static get RIGHT() { return RIGHT }
}

const FORWARD = new RelativeDirection('FORWARD', 1, 0);
const BACK = new RelativeDirection('BACK', -1, 0);
const LEFT = new RelativeDirection('LEFT', 0, -1);
const RIGHT = new RelativeDirection('RIGHT', 0, 1)

export { RelativeDirection }