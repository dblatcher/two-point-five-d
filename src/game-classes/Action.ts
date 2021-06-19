import { Game } from "./Game";
import { Vantage } from "./Vantage";

class Action {
    action: string

    constructor(action: string) {
        this.action = action
    }

    perform(actor: Vantage, game: Game): void {
        console.log('AbstractAction',actor, game);
    }
}

class MovementAction extends Action {
    action: "TURN" | "MOVE"
    direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK"

    constructor(action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK") {
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

export { Action, MovementAction }