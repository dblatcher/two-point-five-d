import { Direction } from "./Direction";
import { Figure } from "./Figure";
import { Game } from "./Game";
import { Position } from "./Position";
import { Sprite } from "./Sprite";
import { Vantage } from "./Vantage";

interface ItemType {
    description: string
}

interface ItemConfig {
    vantage?: Vantage
    sprite: Sprite
    figureDimensions?: { width: number, height: number }
    type: ItemType
}

class Item {
    data: ItemConfig
    constructor(config: ItemConfig) {
        this.data = config
    }

    get figure(): Figure | null {
        const { vantage, sprite, figureDimensions = { width: .2, height: .2 } } = this.data
        if (vantage) {
            return new Figure({
                sprite,
                ...vantage.data,
                ...figureDimensions,
            })
        }

        return null
    }

    handleInteraction(actor: Vantage, game: Game): void {
        const { items } = game.data.level.data;
        if (!game.data.itemInHand) {
            this.takeIntoHand(items, game)
        }
    }

    takeIntoHand(items: Item[], game: Game): void {

        const index = items.indexOf(this);
        if (index !== -1) {
            items.splice(index, 1);
        }

        this.data.vantage = undefined;
        game.data.itemInHand = this;
    }

    placeAt(position: Position, direction: Direction, game: Game): void {
        this.data.vantage = new Vantage({
            ...position.data, direction
        })
        game.data.level.data.items.push(this)
    }
}


export { Item, ItemConfig }