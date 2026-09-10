import { ActorInput } from '@/game-classes/Actor';
import { genericDecisionFunctions } from '@/game-classes/decisionFunctions';
import { Direction } from "../game-classes/Direction";
import { duckPuzzleSprites } from './sprites';


interface DuckConfig {
    x: number
    y: number
    direction: Direction
    behaviour?: keyof typeof genericDecisionFunctions
}

function duck(config: DuckConfig): ActorInput {
    const { x, y, direction, behaviour } = config

    return {
        actorType: '',
        vantage: ({ x, y, direction: direction.name }),
        sprite: duckPuzzleSprites.duckSprite.data.id,
        behaviour,
        height: .5, width: .5
    }
}

export { duck };

