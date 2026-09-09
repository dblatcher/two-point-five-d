import { ActorInput } from '@/game-classes/Actor';
import { Vantage } from '@/game-classes/Vantage';
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
        vantage: new Vantage({ x, y, direction: direction.name }),
        spriteId: duckPuzzleSprites.duckSprite.data.id,
        behaviour,
        height: .5, width: .5
    }
}

export { duck };
