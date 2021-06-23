import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { Direction } from "../game-classes/Direction";
import { Position } from "../game-classes/Position";
import { Vantage } from "../game-classes/Vantage";
import { Wall } from "../game-classes/Wall";

class RenderInstruction {
    place: { position: Position, forward: number, right: number }
    viewedFrom: Direction
    thing?: Position | Vantage
    wall?: Wall
    relativeDirection?: RelativeDirection
    relativePositionInSquare: { forward: number, right: number }

    constructor(config: {
        place: { position: Position, forward: number, right: number },
        viewedFrom: Direction,
        subject: Position | Vantage | Wall,
        relativeDirection?: RelativeDirection
    }
    ) {
        const { place, viewedFrom, subject, relativeDirection } = config
        this.place = place
        this.viewedFrom = viewedFrom

        if (Object.getPrototypeOf(subject).constructor === Wall) {
            this.wall = subject as Wall;
            // to do - calculate and use!
            this.relativePositionInSquare = { forward: .5, right: .5 }
        } else {
            this.thing = subject as Position | Vantage;
            this.relativePositionInSquare = viewedFrom.getRelativeSquarePosition(this.thing);
        }

        this.relativeDirection = relativeDirection
    }

    // TO DO - fix priority of walls and figures in same square, draw in this order:
    // back wall
    // far side wall
    // figures, ordered by least forward first,
    // near side wall
    // front side wall

    static sortFunction = (itemA: RenderInstruction, itemB: RenderInstruction) => {

        if (itemB.place.forward !== itemA.place.forward) {
            return itemB.place.forward - itemA.place.forward
        }

        if (itemA.thing && itemB.thing) {
            return itemB.relativePositionInSquare.forward - itemA.relativePositionInSquare.forward
        }

        function rateDirection(item: RenderInstruction): number {
            if (!item.relativeDirection || item.thing) { return 1.5 }

            if (item.relativeDirection.name === "BACK") { return 1 }
            if (item.relativeDirection.name === "FORWARD") { return 4 }
            if (item.relativeDirection.name == 'LEFT' && item.place.right <= 0) { return 2 }
            if (item.relativeDirection.name == 'RIGHT' && item.place.right >= 0) { return 2 }
            return 3
        }
        return rateDirection(itemB) - rateDirection(itemA)
    }
}

export { RenderInstruction }