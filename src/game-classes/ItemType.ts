import { Color } from "@/canvas/Color";
import { Sprite } from "@/canvas/Sprite";

interface ItemTypeConfig {
    name: string
    figureDimensions?: { width: number, height: number }
    sprite: Sprite
    backgroundColor?: Color
    consumable?: ConsumeableData
    weight?: number
}

interface ConsumeableData {
    nutrition: number
    remains?: ItemType
}

class ItemType {
    data: ItemTypeConfig

    constructor(config: ItemTypeConfig) {
        this.data = config
    }

    get name(): string { return this.data.name }
    get backgroundColor(): Color { return this.data.backgroundColor || Color.TRANSPARENT }
    get isConsumable(): boolean { return !!this.data.consumable }

    get propertyList(): [string, string | number][] {
        const list: [string, string | number][] = [];

        list.push(['name', this.data.name]);
        list.push(['weight', this.data.weight || 0]);

        if (this.data.consumable) {
            list.push(['consumable', this.data.consumable.nutrition]);
        }

        return list;
    }
}

export { ItemType, ItemTypeConfig }