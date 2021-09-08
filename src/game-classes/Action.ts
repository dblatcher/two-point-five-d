import { Point } from "@/canvas/canvas-utility";
import { Actor } from "@/game-classes/Actor";
import { Game } from "./Game";
import { Item } from "./Item";
import { Position } from "./Position";
import { RelativeDirection } from "./RelativeDirection";
import { Vantage } from "./Vantage";
import { WallFeature } from "./WallFeature";

class Action {
    action: string
    duration: number
    tickCount: number
    somethingHappensOnFinish: boolean

    constructor(action: string) {
        this.action = action
        this.duration = 1
        this.tickCount = 0
        this.somethingHappensOnFinish = false
    }

    start(actor: Vantage | Actor, game: Game): void {
        console.warn(`No start function defined for Action ${this.action}`, actor);
    }

    onContinue(actor: Vantage | Actor, game: Game): void {
        return
    }

    onFinish(actor: Vantage | Actor, game: Game): void {
        console.warn(`No onFinish function defined for Action ${this.action}`, actor);
    }

    get isFinished(): boolean {
        return this.tickCount >= this.duration
    }
}

class MovementAction extends Action {
    action: "TURN" | "MOVE"
    direction: RelativeDirection

    constructor(action: "TURN" | "MOVE", direction: RelativeDirection) {
        super(action);
        this.action = action;
        this.direction = direction;
    }

    start(actor: Vantage | Actor, game: Game): void {
        switch (this.action) {
            case "MOVE": return actor.move(this.direction, game);
            case "TURN": return actor.turn(this.direction);
        }
    }
}

class MovementByAction extends Action {
    action: "MOVEBY"
    direction: RelativeDirection
    distance: number

    constructor(distance: number, direction: RelativeDirection) {
        super("MOVEBY");
        this.action = "MOVEBY";
        this.distance = distance;
        this.direction = direction;
    }

    start(actor: Vantage | Actor, game: Game): void {
        return actor.moveBy(this.distance, this.direction, game);
    }
}

class ShiftAction extends Action {
    action: "SHIFT"
    position: Point

    constructor(position: Point) {
        super("SHIFT")
        this.action = "SHIFT"
        this.position = position;
    }

    start(actor: Vantage | Actor, game: Game): void {
        actor.shiftWithinSquare(this.position, game)
    }

}

class InterAction extends Action {
    action: "INTERACT"
    feature: WallFeature | Item

    constructor(target: WallFeature | Item) {
        super("INTERACT")
        this.action = "INTERACT"
        this.feature = target
    }

    start(actor: Vantage | Actor, game: Game): void {
        this.feature.handleInteraction(actor, game);
    }
}

class NpcInterAction extends Action {
    action: "INTERACT"
    actor: Actor

    constructor(target: Actor) {
        super("INTERACT")
        this.action = "INTERACT"
        this.actor = target
    }

    start(actor: Vantage | Actor, game: Game): void {
        this.actor.handleInteraction(actor, game);
    }
}

interface ActionCallback {
    (actor: Vantage | Actor, game: Game): void
}

class DoAction extends Action {
    action: "DO"
    animation: string
    duration: number
    callBack?: ActionCallback

    constructor(animation: string, duration: number, callback?: ActionCallback) {
        super("DO")
        this.action = "DO"
        this.animation = animation
        this.duration = duration
        this.somethingHappensOnFinish = true
        this.callBack = callback
    }

    start(actor: Vantage | Actor, game: Game): void {
        // console.log(`Actor should DO :  ${this.animation}`);
    }

    onFinish(actor: Vantage | Actor, game: Game): void {
        if (this.callBack) {
            this.callBack(actor, game)
        }
    }
}

class WalkForward extends Action {
    declare action: "WALK_FORWARD"
    destination: Vantage | null
    location: Vantage | null
    shouldCancel: boolean
    distance: number
    speed: number
    stubborn: boolean

    constructor(distance = 1, speed = .05, stubborn = true) {
        super("WALK_FORWARD");
        this.destination = null
        this.location = null
        this.shouldCancel = false
        this.distance = distance
        this.speed = speed
        this.stubborn = stubborn
    }


    start(actor: Actor, game: Game): void {
        const { vantage } = actor.data;
        if (!vantage) {
            this.shouldCancel = true
        } else {
            this.destination = vantage.translateToVantage({
                x: vantage.data.direction.x * this.distance,
                y: vantage.data.direction.y * this.distance,
            })
            this.location = vantage
        }
    }

    onContinue(actor: Actor, game: Game): void {
        const { location, destination, speed, stubborn } = this
        if (location && destination) {


            if (stubborn) { // will only cancel if blocked by wall
                if (game.data.level.hasSquareAheadBlockedByWall(location)) {
                    this.shouldCancel = true
                    return
                }
            } else { //will cancel if blocked by other anything, including other actors
                const blockage = game.data.level.findBlockage(...location.coords, ...location.translate(location.data.direction).coords, actor, game)
                if (blockage) {
                    this.shouldCancel = true
                    return
                }
            }
        }
        actor.moveBy(speed, RelativeDirection.FORWARD, game)
        this.location = actor.data.vantage || null;

    }

    onFinish(actor: Vantage | Actor, game: Game): void {
        console.warn(`No onFinish function defined for Action ${this.action}`, actor);
    }

    get isFinished(): boolean {
        const { destination, location, shouldCancel, speed } = this;
        if (shouldCancel) { return true }
        if (!destination || !location) { return true }
        return destination.isAlmostExactlyTheSamePlaceAs(location, speed);
    }

}


export { Action, MovementAction, InterAction, ShiftAction, MovementByAction, NpcInterAction, DoAction, WalkForward }