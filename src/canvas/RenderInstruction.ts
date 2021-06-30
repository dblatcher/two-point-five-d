import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { Direction } from "../game-classes/Direction";
import { Position } from "../game-classes/Position";
import { Vantage } from "../game-classes/Vantage";
import { Wall } from "../game-classes/Wall";

const LOG_RENDER_ORDER = false;

class RenderInstruction {
    place: { position: Position, forward: number, right: number }
    viewedFrom: Direction
    thing?: Position | Vantage
    wall?: Wall
    relativeDirection?: RelativeDirection
    relativePositionInSquare: { forward: number, right: number }
    isReverseOfWall: boolean
    subjectClass: typeof Wall | typeof Vantage | typeof Position

    constructor(config: {
        place: { position: Position, forward: number, right: number },
        viewedFrom: Direction,
        subject: Position | Vantage | Wall,
    }
    ) {
        const { place, viewedFrom, subject } = config
        this.place = place
        this.viewedFrom = viewedFrom

        if (Object.getPrototypeOf(subject).constructor === Wall) {
            this.subjectClass = Wall
        }
        else if (subject.isVantage)
            this.subjectClass = Vantage
        else {
            this.subjectClass = Position
        }


        if (this.subjectClass === Wall) {
            this.wall = subject as Wall;
            // to do - calculate and use!

            this.relativeDirection = this.wall.data.place.relativeDirection(viewedFrom)
            // wall relative direction is which edge of the square it makes up, not the direction it faces

            if (this.relativeDirection.r == 0) {
                this.isReverseOfWall = this.wall.data.place.name != viewedFrom.name
            } else {

                if (this.relativeDirection.r == 1 && this.place.right >= 0) { this.isReverseOfWall = true }
                else if (this.relativeDirection.r == -1 && this.place.right <= 0) { this.isReverseOfWall = true }
                else { this.isReverseOfWall = false }
            }

            switch (this.relativeDirection.name) {
                case "BACK":
                    this.relativePositionInSquare = { forward: -.5, right: 0 }
                    break
                case "LEFT":
                    this.relativePositionInSquare = { forward: this.place.right <= 0 ? .5 : -.5, right: -.5 }
                    break
                case "RIGHT":
                    this.relativePositionInSquare = { forward: this.place.right >= 0 ? .5 : -.5, right: .5 }
                    break
                case "FORWARD":
                    this.relativePositionInSquare = { forward: .5, right: 0 }
                    break
            }

        } else if (this.subjectClass === Vantage) {
            this.thing = subject;
            this.isReverseOfWall = false
            this.relativePositionInSquare = viewedFrom.getRelativeSquarePosition(this.thing);
            this.relativePositionInSquare.forward -= .5;
            this.relativePositionInSquare.right -= .5;
            this.relativeDirection = (this.thing as Vantage).data.direction.relativeDirection(this.viewedFrom);
        } else {
            this.thing = subject;
            this.isReverseOfWall = false
            this.relativePositionInSquare = viewedFrom.getRelativeSquarePosition(this.thing);
            this.relativePositionInSquare.forward -= .5;
            this.relativePositionInSquare.right -= .5;
        }

    }

    get exactPlace(): { forward: number, right: number } {
        return {
            forward: this.place.forward + this.relativePositionInSquare.forward,
            right: this.place.right + this.relativePositionInSquare.right,
        }
    }

    static sortFunction = (itemA: RenderInstruction, itemB: RenderInstruction): number => {

        if ((itemA.subjectClass === Wall) !== (itemB.subjectClass === Wall)) {
            if (itemA.isReverseOfWall || itemB.isReverseOfWall) {
                const itemAForward = itemA.isReverseOfWall ? itemA.place.forward - 1 : itemA.place.forward;
                const itemBForward = itemB.isReverseOfWall ? itemB.place.forward - 1 : itemB.place.forward;
                return itemBForward - itemAForward
            }
        }

        if (itemA.exactPlace.forward !== itemB.exactPlace.forward) {
            return itemB.exactPlace.forward - itemA.exactPlace.forward
        }

        if (itemA.subjectClass === Wall && itemB.subjectClass === Wall) {
            const itemAisHeadOn = itemA.relativeDirection?.r === 0;
            const itemBisHeadOn = itemB.relativeDirection?.r == 0;

            if (itemAisHeadOn && !itemBisHeadOn) {
                return itemB.isReverseOfWall ? -1 : 1
            }

            if (!itemAisHeadOn && itemBisHeadOn) {
                return itemA.isReverseOfWall ? 1 : -1
            }
        }

        if (Math.sign(itemA.exactPlace.right) == Math.sign(itemB.exactPlace.right)) {
            return Math.abs(itemB.exactPlace.right) - Math.abs(itemA.exactPlace.right)
        }

        return 0
    }

    static putInOrder(list: RenderInstruction[]): RenderInstruction[] {

        const sortedList = list.sort(RenderInstruction.sortFunction);

        if (LOG_RENDER_ORDER) {
            console.log("***")
            sortedList
                .forEach(item => {
                    if (item.subjectClass == Wall) {
                        console.log('WALL', item.exactPlace, item.relativeDirection?.r !== 0 ? 'side facing,' : 'head on,', item.isReverseOfWall ? 'reverse face' : 'front face')
                    }
                    if (item.subjectClass == Vantage) {
                        console.log('FIGURE', item.exactPlace)
                    }
                })
        }

        return sortedList
    }
}

export { RenderInstruction }