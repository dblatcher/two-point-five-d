import { Game } from "./Game";
import { Vantage, VantageConfig } from "./Vantage";

class Reaction {
    effect: string

    constructor(effect: string) {
        this.effect = effect
    }

    fire(actor: Vantage, game: Game): void {
        console.warn(`No performance class defined for Reaction ${this.effect}`, actor);
    }
}

class TeleportReaction extends Reaction {
    effect: "TELEPORT"
    destination: VantageConfig

    constructor(destination: VantageConfig) {
        super("TELEPORT")
        this.effect = "TELEPORT"
        this.destination = destination
    }

    fire(actor: Vantage, game: Game): void {
        const { x, y, direction } = this.destination;
        actor.data.direction = direction;
        actor.data.x = x;
        actor.data.y = y;

        //to do - check if anything is already at destination?
    }

}

export { Reaction, TeleportReaction }