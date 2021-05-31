import { duckSprite } from '@/store/sprites'
import { Direction } from "./Direction";
import { Figure } from "./Figure";


interface DuckConfig {
    x: number
    y: number
    direction: Direction
}

class Duck extends Figure {

    constructor(config: DuckConfig) {
        const figureConfig = Object.assign(config, {
            sprite: duckSprite,
            height: .5,
            width: .5,
        })
        super(figureConfig);
    }
}

export { Duck }