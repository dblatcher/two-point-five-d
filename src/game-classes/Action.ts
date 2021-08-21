import { Point } from "@/canvas/canvas-utility";
import { Actor } from "@/game-classes/Actor";
import { Game } from "./Game";
import { Item } from "./Item";
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

    perform(actor: Vantage | Actor, game: Game): void {
        console.warn(`No perform function defined for Action ${this.action}`, actor);
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

    perform(actor: Vantage | Actor, game: Game): void {
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

    perform(actor: Vantage | Actor, game: Game): void {
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

    perform(actor: Vantage | Actor, game: Game): void {
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

    perform(actor: Vantage | Actor, game: Game): void {
        this.feature.handleInteraction(actor, game);
    }
}

class NpcInterAction extends Action {
    action: "INTERACT"
    npc: Actor

    constructor(target: Actor) {
        super("INTERACT")
        this.action = "INTERACT"
        this.npc = target
    }

    perform(actor: Vantage | Actor, game: Game): void {
        this.npc.handleInteraction(actor, game);
    }
}

interface ActionCallback {
    (actor:Vantage|Actor, game: Game): void
}

class DoAction extends Action {
    action: "DO"
    animation: string
    duration: number
    callBack?: ActionCallback

    constructor(animation: string, duration: number, callback?:ActionCallback) {
        super("DO")
        this.action = "DO"
        this.animation = animation
        this.duration = duration
        this.somethingHappensOnFinish = true
        this.callBack = callback
    }

    perform(actor: Vantage | Actor, game: Game): void {
        console.log(`Actor should DO :  ${this.animation}`);
    }

    onFinish(actor: Vantage | Actor, game: Game): void {
        if (this.callBack) {
            this.callBack(actor, game)
        }
    }
}

export { Action, MovementAction, InterAction, ShiftAction, MovementByAction, NpcInterAction, DoAction }