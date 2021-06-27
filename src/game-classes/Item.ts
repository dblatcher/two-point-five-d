import { Figure } from "./Figure";
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
}


export { Item, ItemConfig }