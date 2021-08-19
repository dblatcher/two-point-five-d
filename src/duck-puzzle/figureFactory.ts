import { sprites } from './sprites'
import { Behaviour } from '../game-classes/Behaviour';
import { Direction } from "../game-classes/Direction";
import { Actor } from '@/game-classes/Actor';
import { Vantage } from '@/game-classes/Vantage';



interface DuckConfig {
    x: number
    y: number
    direction: Direction
    behaviour?: Behaviour
}

function duck(config: DuckConfig): Actor {
    const { x, y, direction, behaviour } = config

    return new Actor({
        vantage: new Vantage({ x, y, direction }),
        sprite: sprites.duckSprite,
        behaviour,
        height:.5, width:.5
    })
}

export { duck }