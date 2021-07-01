import { sprites } from '@/instances/sprites'
import { Behaviour } from '../game-classes/Behaviour';
import { Direction } from "../game-classes/Direction";
import { Figure } from "../game-classes/Figure";


interface DuckConfig {
    x: number
    y: number
    direction: Direction
    behaviour?: Behaviour
}

function duck(config: DuckConfig): Figure {
    const figureConfig = Object.assign(config, {
        sprite: sprites.duckSprite,
        height: .5,
        width: .5,
    })
    return new Figure(figureConfig)
}

export { duck }