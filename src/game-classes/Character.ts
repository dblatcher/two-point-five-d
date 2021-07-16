import { Direction } from "./Direction";
import { Game } from "./Game";
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

    say(message: string, game: Game): void {
        console.log(`CHARACTER: "${message}"`)
    }

    consume(item: Item, game: Game):void {
        this.say(`I want to eat this ${item.data.type.name}`, game);
        if (item.data.type.data.consumable) {
            if (item.data.type.data.consumable.remains) {
                game.data.itemInHand = new Item({ type: item.data.type.data.consumable.remains })
            }
        }
    }

}

export { Character, CharacterConfig }