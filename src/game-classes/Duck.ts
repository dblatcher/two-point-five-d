import { sprites } from '@/store/sprites'
import { Behaviour } from './Behaviour';
import { Direction } from "./Direction";
import { Figure } from "./Figure";


interface DuckConfig {
    x: number
    y: number
    direction: Direction
    behaviour?: Behaviour
}

function duck(config: DuckConfig) {
    const figureConfig = Object.assign(config, {
        sprite: sprites.duckSprite,
        height: .5,
        width: .5,
    })
    return new Figure(figureConfig)
}

export { duck }