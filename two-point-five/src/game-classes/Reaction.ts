import { Actor } from "@/game-classes/Actor";
import { Game } from "./Game";
import { Vantage, VantageConfig } from "./Vantage";
import { Wall } from "./Wall";


interface TeleportConfig {
    reactionType: 'TELEPORT',
    destination: VantageConfig,
}

interface ChangeLevelConfig {
    reactionType: 'CHANGE_LEVEL'
    destination: VantageConfig
    levelIndex: number
}

interface TunnelConfig {
    reactionType: 'TUNNEL',
    startId: string;
    destinationId: string;
}

export type ReactionConfig = TeleportConfig | ChangeLevelConfig | TunnelConfig


export abstract class Reaction {
    effect: string
    config: {
        reactionType: string
    }
    constructor(effect: string) {
        this.effect = effect
        this.config = {
            reactionType: effect
        }
    }
    abstract serialise(): ReactionConfig
    abstract fire(actor: Vantage | Actor, _game: Game): void
}


export class TeleportReaction extends Reaction {
    config: TeleportConfig

    constructor(config: TeleportConfig) {
        super("TELEPORT")
        this.config = config
    }
    serialise() {
        return this.config
    }
    fire(actor: Vantage | Actor, _game: Game): void {
        const { x, y, direction } = this.config.destination;

        if (actor instanceof Actor) {
            console.log('Actor teleport');
            const npc = actor as Actor;
            if (npc.data.vantage) {
                npc.data.vantage.data.direction = direction;
                npc.data.vantage.data.x = x;
                npc.data.vantage.data.y = y;
            }
        } else {
            (actor).data.direction = direction;
            (actor).data.x = x;
            (actor).data.y = y;
        }

        //to do - check if anything is already at destination?
    }

}



export class ChangeLevelReaction extends Reaction {
    config: ChangeLevelConfig

    constructor(config: ChangeLevelConfig) {
        super("CHANGE_LEVEL")
        this.config = config
    }
    serialise() {
        return this.config
    }
    fire(actor: Vantage, game: Game): void {
        if (actor !== game.data.playerVantage) {
            console.warn('only the player can change levels')
            return
        }
        game.changeLevel(this.config.levelIndex, new Vantage(this.config.destination));
        //to do - check if anything is already at destination?
    }

}

export class TunnelReaction extends Reaction {
    config: TunnelConfig
    constructor(config: TunnelConfig) {
        super("TUNNEL")
        this.config = config
    }
    serialise() {
        return this.config
    }
    fire(actor: Vantage, game: Game): void {
        if (actor !== game.data.playerVantage) {
            console.warn('only the player can change levels')
            return
        }

        let levelIndex = 0, wallIndex = 0;
        let wallWithDestination: Wall | undefined = undefined;
        for (levelIndex = 0; levelIndex < game.data.levels.length; levelIndex++) {
            const level = game.data.levels[levelIndex];

            for (wallIndex = 0; wallIndex < level.data.walls.length; wallIndex++) {
                const wall = level.data.walls[wallIndex];
                if (wall.features.find(feature => feature.data.reactions?.some(reaction =>
                    reaction instanceof TunnelReaction && reaction.config.startId === this.config.destinationId
                ))) {
                    wallWithDestination = wall
                    break;
                }
            }
            if (wallWithDestination) { break }
        }

        if (wallWithDestination) {
            game.changeLevel(levelIndex, new Vantage({
                x: wallWithDestination.gridX,
                y: wallWithDestination.gridY,
                direction: wallWithDestination.place.name
            }));
            return
        }
        console.warn('could not find other end for', this)
        return
    }
}


export const buildReaction = (config: ReactionConfig): Reaction => {
    switch (config.reactionType) {
        case "TELEPORT": return new TeleportReaction(config)
        case "CHANGE_LEVEL": return new ChangeLevelReaction(config)
        case "TUNNEL": return new TunnelReaction(config)
    }
}

export function makeTwoWayTunnel(id1: string, id2: string): [TunnelConfig, TunnelConfig] {
    const end1: TunnelConfig = {
        reactionType: 'TUNNEL',
        startId: id1,
        destinationId: id2
    };
    const end2: TunnelConfig = {
        reactionType: 'TUNNEL',
        startId: id2,
        destinationId: id1
    };
    return [end1, end2];
}
