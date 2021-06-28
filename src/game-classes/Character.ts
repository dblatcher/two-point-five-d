import { Direction } from "./Direction";
import { Item } from "./Item";
import { Vantage } from "./Vantage";

interface CharacterConfig {
    x: number
    y: number
    direction: Direction
    inventory: Array<Item | null>
}

class Character extends Vantage {
    data: CharacterConfig
    constructor(config: CharacterConfig) {
        super(config)
        this.data = config
    }

}

export { Character, CharacterConfig }