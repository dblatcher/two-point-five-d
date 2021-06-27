import { Figure } from "./Figure";
import { Game } from "./Game";
import { Sprite } from "./Sprite";
import { Vantage } from "./Vantage";

interface ItemConfig {
    vantage?: Vantage
    sprite: Sprite
    figureDimensions?: { width: number, height: number }
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

    handleInteraction(actor:Vantage, game: Game): void {
        console.log('interacted with',this,game,actor)
    }
}


export { Item, ItemConfig }