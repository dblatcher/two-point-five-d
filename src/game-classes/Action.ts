import { Game } from "./Game";
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

class InterAction extends Action {
    action: "INTERACT"
    feature: WallFeature

    constructor(target: WallFeature) {
        super("INTERACT")
        this.action = "INTERACT"
        this.feature = target
    }

    perform(actor: Vantage, game: Game): void {
        this.feature.handleInteraction(actor, game);
    }
}

export { Action, MovementAction, InterAction }