import { Point } from "@/canvas/canvas-utility";
import { Game } from "./Game";
import { Item } from "./Item";
import { RelativeDirection } from "./RelativeDirection";
import { Vantage } from "./Vantage";
import { WallFeature } from "./WallFeature";

class Action {
    action: string

    constructor(action: string) {
        this.action = action
    }

    perform(actor: Vantage, game: Game): void {
        console.warn(`No performance class defined for Action ${this.action}`, actor);
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

    perform(actor: Vantage, game: Game): void {
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

    perform(actor: Vantage, game: Game): void {
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

    perform(actor: Vantage, game: Game): void {
        actor.shiftWithinSquare(this.position, game)
    }

}

class InterAction extends Action {
    action: "INTERACT"
    feature: WallFeature | Item

    constructor(target: WallFeature|Item) {
        super("INTERACT")
        this.action = "INTERACT"
        this.feature = target
    }

    perform(actor: Vantage, game: Game): void {
        this.feature.handleInteraction(actor, game);
    }
}

export { Action, MovementAction, InterAction, ShiftAction, MovementByAction }