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

class OneForward extends Action {
    declare action: "ONE_FORWARD"
    destination: Position | null
    location: Position | null
    shouldCancel: boolean

    constructor() {
        super("ONE_FORWARD");
        this.destination = null
        this.location = null
        this.shouldCancel = false

        console.log('one forward created')
    }


    start(actor: Actor, game: Game): void {
        const { vantage } = actor.data;
        if (!vantage) {
            this.shouldCancel = true
        } else {
            this.destination = vantage.translate(vantage.data.direction)
            this.location = vantage 
        }
    }

    onContinue(actor: Actor, game: Game): void {
        const {location, destination} = this
        if (location && destination) {
            if (game.data.level.isBlocked(...location.coords, ...destination.coords,actor,game)) {
                this.shouldCancel = true
                return
            }
        }
        actor.moveBy(.05, RelativeDirection.FORWARD, game)
        this.location = actor.data.vantage || null;

    }

    onFinish(actor: Vantage | Actor, game: Game): void {
        console.warn(`No onFinish function defined for Action ${this.action}`, actor);
    }

    get isFinished(): boolean {
        const { destination, location, shouldCancel } = this;
        if (shouldCancel) { return true }
        if (!destination || !location) { return true }
        return destination.isAlmostExactlyTheSamePlaceAs(location);
    }

}

export { Action, MovementAction, InterAction, ShiftAction, MovementByAction, NpcInterAction, DoAction, OneForward }