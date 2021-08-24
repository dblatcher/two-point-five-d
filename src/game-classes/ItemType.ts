import { Color } from "@/canvas/Color";
import { Sprite } from "@/canvas/Sprite";
import { AttackOption } from "@/rpg-classes/AttackOption";

interface ItemTypeConfig {
    name: string
    figureDimensions?: { width: number, height: number }
    sprite: Sprite
    iconSprite?: Sprite
    backgroundColor?: Color
    weight?: number
    consumable?: ConsumeableData
    equipable?: EquipableData
    wieldable?: WieldableData
}

interface ConsumeableData {
    nutrition: number
    remains?: ItemType
}

interface EquipableData {
    slotName: string
}



interface WieldableData {
    attackOptions: AttackOption[]
}

class ItemType {
    data: ItemTypeConfig

    constructor(config: ItemTypeConfig) {
        this.data = config
    }

    get name(): string { return this.data.name }
    get backgroundColor(): Color { return this.data.backgroundColor || Color.TRANSPARENT }
    get isConsumable(): boolean { return !!this.data.consumable }
    get isEquipable(): boolean { return !!this.data.equipable }
    get isWieldable(): boolean {return !!this.data.wieldable}

    get icon(): Sprite { return this.data.iconSprite || this.data.sprite}

    get propertyList(): [string, string | number][] {
        const list: [string, string | number][] = [];

        list.push(['name', this.data.name]);
        list.push(['weight', this.data.weight || 0]);

        if (this.data.consumable) {
            list.push(['consumable', this.data.consumable.nutrition]);
        }
        if (this.data.equipable) {
            list.push(['equipable', this.data.equipable.slotName]);
        }
        if (this.data.wieldable) {
            this.data.wieldable.attackOptions.forEach(option => {
                const {name, staminaCost, damage, cooldown} = option.data
                list.push([name, `St${staminaCost}, Dam${damage}, Cd${cooldown}`])
            })
        }

        return list;
    }
}

export { ItemType, ItemTypeConfig }