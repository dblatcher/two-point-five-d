import { Direction } from "./Direction";
import { FeedbackToUI, Game } from "./Game";
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

    consume(item: Item, game: Game):FeedbackToUI {
        this.say(`I want to eat this ${item.data.type.name}.`, game);
        if (!item.data.type.data.consumable) {
            this.say(`But I cannot!`, game);
            return new FeedbackToUI ({message: `${item.data.type.name} is not consumable!`})
        }
        if (item.data.type.data.consumable.remains) {
            this.say(`*eats*`, game);
            game.data.itemInHand = new Item({ type: item.data.type.data.consumable.remains })
        } else {
            game.data.itemInHand  = undefined
        }

        return new FeedbackToUI({message:`nutrition was ${item.data.type.data.consumable.nutrition}!`})
    }

}

export { Character, CharacterConfig }