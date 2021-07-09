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

class ChangeLevelReaction extends Reaction {
    effect: "CHANGE_LEVEL"
    destination: VantageConfig
    levelIndex: number

    constructor(levelIndex: number, destination: VantageConfig) {
        super("CHANGE_LEVEL")
        this.effect = "CHANGE_LEVEL"
        this.destination = destination
        this.levelIndex = levelIndex
    }

    fire(actor: Vantage, game: Game): void {
        if (actor !== game.data.playerCharacter) {
            console.warn('only the player can change levels')
            return
        }
        game.changeLevel(this.levelIndex, new Vantage(this.destination));
        //to do - check if anything is already at destination?
    }

}

class TunnelReaction extends Reaction {
    otherEnd: Reaction

    constructor() {
        super("TUNNEL")
        this.otherEnd = this
    }

    fire(actor: Vantage, game: Game): void {
        if (actor !== game.data.playerCharacter) {
            console.warn('only the player can change levels')
            return
        }
        if (!this.otherEnd) {
            console.warn('no other end set for', this)
            return
        }

        let foundPair = false, levelIndex = 0, wallIndex = 0;
        for (levelIndex = 0; levelIndex < game.data.levels.length; levelIndex++) {
            const level = game.data.levels[levelIndex];

            for (wallIndex = 0; wallIndex < level.data.walls.length; wallIndex++) {
                const wall = level.data.walls[wallIndex];
                if (wall.data.features?.find(feature => feature.data.reactions?.includes(this.otherEnd))) {
                    foundPair = true
                    break;
                }
            }
            if (foundPair) { break }
        }

        if (!foundPair) {
            console.warn('could not find other end for', this)
            return
        }

        const wall = game.data.levels[levelIndex].data.walls[wallIndex];
        game.changeLevel(levelIndex, new Vantage({ x: wall.gridX, y: wall.gridY, direction: wall.data.place }));
    }
}

function makeTunnel(): [TunnelReaction, TunnelReaction] {
    const end1 = new TunnelReaction();
    const end2 = new TunnelReaction();
    end1.otherEnd = end2
    end2.otherEnd = end1
    return [end1, end2];
}

export { Reaction, TeleportReaction, ChangeLevelReaction, makeTunnel, TunnelReaction }