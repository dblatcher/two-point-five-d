import { FloorFeature } from "@/game-classes/FloorFeature";
import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { Direction } from "../game-classes/Direction";
import { Position } from "../game-classes/Position";
import { Vantage } from "../game-classes/Vantage";
import { Wall } from "../game-classes/Wall";
import { RelativePoint } from "@/canvas/canvas-utility";
import { Level } from "@/game-classes/Level";

const LOG_RENDER_ORDER = false;

class RenderInstruction {
    place: { position: Position, forward: number, right: number }
    observer: Vantage
    thing?: Position | Vantage
    wall?: Wall
    level: Level
    relativeDirection?: RelativeDirection
    relativePositionInSquare: { forward: number, right: number }
    isReverseOfWall: boolean
    subjectClass: typeof Wall | typeof Vantage | typeof Position | typeof FloorFeature

    constructor(config: {
        place: { position: Position, forward: number, right: number },
        observer: Vantage,
        subject: Position | Vantage | Wall,
        level: Level,
    }
    ) {
        const { place, observer, subject, level } = config
        this.place = place
        this.observer = observer
        this.level = level

        if (Object.getPrototypeOf(subject).constructor === Wall) {
            this.subjectClass = Wall
        }
        else if (subject.isFloorFeature)
            this.subjectClass = FloorFeature
        else if (subject.isVantage)
            this.subjectClass = Vantage
        else {
            this.subjectClass = Position
        }


        if (this.subjectClass === Wall) {
            this.wall = subject as Wall;

            // to do - use Wall method
            this.relativeDirection = this.wall.data.place.relativeDirection(observer.data.direction)
            // wall relative direction is which edge of the square it makes up, not the direction it faces

            this.isReverseOfWall = this.wall.reverseSideShowingfrom(observer);

            switch (this.relativeDirection.name) {
                case "BACK":
                    this.relativePositionInSquare = { forward: -.5, right: 0 }
                    break
                case "LEFT":
                    this.relativePositionInSquare = { forward: .5, right: -.5 }
                    break
                case "RIGHT":
                    this.relativePositionInSquare = { forward: .5, right: .5 }
                    break
                case "FORWARD":
                    this.relativePositionInSquare = { forward: .5, right: 0 }
                    break
            }

        } else if (this.subjectClass === Vantage || this.subjectClass === FloorFeature) {
            this.thing = subject;
            this.isReverseOfWall = false
            this.relativePositionInSquare = observer.data.direction.getRelativeSquarePosition(this.thing);
            this.relativePositionInSquare.forward -= .5;
            this.relativePositionInSquare.right -= .5;
            this.relativeDirection = (this.thing as Vantage).data.direction.relativeDirection(this.observer.data.direction);
        } else {
            this.thing = subject;
            this.isReverseOfWall = false
            this.relativePositionInSquare = observer.data.direction.getRelativeSquarePosition(this.thing);
            this.relativePositionInSquare.forward -= .5;
            this.relativePositionInSquare.right -= .5;
        }

    }

    get viewedFrom(): Direction {
        return this.observer.data.direction
    }

    get exactPlace(): RelativePoint {
        return {
            f: this.place.forward + this.relativePositionInSquare.forward,
            r: this.place.right + this.relativePositionInSquare.right,
        }
    }

    static sortFunction = (itemA: RenderInstruction, itemB: RenderInstruction): number => {

        //sort by grid row first
        if (itemA.place.forward !== itemB.place.forward) {
            return itemB.place.forward - itemA.place.forward
        }

        // if they are walls in the same exact place, render the reverse side first
        if (itemA.subjectClass === Wall && itemB.subjectClass === Wall) {
            if (itemA.exactPlace.r === itemB.exactPlace.r && itemA.exactPlace.f === itemB.exactPlace.f) {
                if (itemA.isReverseOfWall !== itemB.isReverseOfWall) {
                    return itemA.isReverseOfWall ? -1 : 1
                }
            }
        }

        //render floor features before figures or walls
        if ((itemA.subjectClass === FloorFeature) !== (itemB.subjectClass === FloorFeature)) {
            return itemA.subjectClass === FloorFeature ? -1 : 1
        }

        // if one is a wall and the other isn't
        // render a further to the side wall before a figure, but a closer to the side wall after
        if ((itemA.subjectClass === Wall) !== (itemB.subjectClass === Wall)) {
            const theWallIsSideFacing = (itemA.subjectClass === Wall && itemA.relativeDirection?.r != 0) || (itemB.subjectClass === Wall && itemB.relativeDirection?.r != 0)
            if (theWallIsSideFacing) {
                return Math.abs(itemB.exactPlace.r) - Math.abs(itemA.exactPlace.r)
            }
        }

        //then sort by grid column, further out first, unless neither is a wall
        //TO DO - fix the inner test here - looks wrong!
        if (itemA.place.right !== itemB.place.right) {
            if ((itemA.subjectClass !== Wall) || (itemB.subjectClass === Wall)) {
                return Math.abs(itemB.place.right) - Math.abs(itemA.place.right)
            }
        }

        // render the further forward item first
        if (itemA.exactPlace.f !== itemB.exactPlace.f) {
            return itemB.exactPlace.f - itemA.exactPlace.f
        }

        // render items further to the side first
        if (Math.sign(itemA.exactPlace.r) == Math.sign(itemB.exactPlace.r)) {
            return Math.abs(itemB.exactPlace.r) - Math.abs(itemA.exactPlace.r)
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
                        console.log('WALL', [item.place.forward, item.place.right], item.exactPlace, item.relativeDirection?.r !== 0 ? 'side facing,' : 'head on,', item.isReverseOfWall ? 'reverse face' : 'front face')
                    }
                    if (item.subjectClass == Vantage) {
                        console.log('FIGURE', [item.place.forward, item.place.right], item.exactPlace)
                    }
                    if (item.subjectClass == FloorFeature) {
                        console.log('FloorFeature', [item.place.forward, item.place.right], item.exactPlace)
                    }
                })
        }

        return sortedList
    }
}

export { RenderInstruction }