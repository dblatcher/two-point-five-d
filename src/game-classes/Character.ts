import { Direction } from "./Direction";
import { FeedbackToUI, Game } from "./Game";
import { Item } from "./Item";
import { Vantage } from "./Vantage";

interface CharacterConfig {
    name?:string
    inventory: Array<Item | null>
    equipmentSlots?: Map<string, Item | null>
}

class Character {
    data: CharacterConfig
    constructor(config: CharacterConfig) {
        this.data = config
    }

    say(message: string, game: Game): void {
        console.log(`${this.data.name || "NAMELESS_CHARACTER"}: "${message}"`)
    }

    consume(item: Item, game: Game): FeedbackToUI {
        this.say(`I want to eat this ${item.data.type.name}.`, game);
        if (!item.data.type.data.consumable) {
            this.say(`But I cannot!`, game);
            return new FeedbackToUI({ message: `${item.data.type.name} is not consumable!` })
        }
        if (item.data.type.data.consumable.remains) {
            this.say(`*eats*`, game);
            game.data.itemInHand = new Item({ type: item.data.type.data.consumable.remains })
        } else {
            game.data.itemInHand = undefined
        }

        return new FeedbackToUI({ message: `nutrition was ${item.data.type.data.consumable.nutrition}!` })
    }

    equip(slotName: string, itemInHand: Item | undefined, game: Game): FeedbackToUI {
        const { equipmentSlots } = this.data

        if (!equipmentSlots || !equipmentSlots.has(slotName)) {
            console.warn('UI looking for nonexistant equipment slot', slotName)
            return FeedbackToUI.empty
        }

        const currentEquipment = equipmentSlots.get(slotName);

        if (itemInHand) {
            const canEquipInSlot = itemInHand.data.type.data.equipable?.slotName === slotName;
            if ( canEquipInSlot ) {
                game.data.itemInHand = currentEquipment || undefined
                this.data.equipmentSlots?.set(slotName,itemInHand)
                return FeedbackToUI.yes
            } else {
                return FeedbackToUI.no
            }
        }

        if (currentEquipment) {
            game.data.itemInHand = currentEquipment
            this.data.equipmentSlots?.set(slotName,null)
            return FeedbackToUI.yes
        }

        return FeedbackToUI.empty
    }
}

export { Character, CharacterConfig }