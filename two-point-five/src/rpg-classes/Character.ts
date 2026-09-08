import { Color } from "@/canvas/Color";
import { ItemType } from "@/game-classes/ItemType";
import { makeItemFunction } from "@/game-classes/constructionHelpers";
import { FeedbackToUI, Game } from "../game-classes/Game";
import { Item } from "../game-classes/Item";
import { PlayerVantage } from "../game-classes/PlayerVantage";
import { AttackOption } from "./AttackOption";
import { CharacterStats, CharacterStatsInput } from "./CharacterStats";
import { Monster } from "./Monster";


type EquipmentSlot = "HEAD" | "TORSO" | "LEGS" | "FEET" | "RIGHT_HAND" | "LEFT_HAND"

interface CharacterData {
    name?: string
    inventory: Array<Item | null>
    equipmentSlots?: Map<string, Item | null>
    portraitSpriteId: string
    stats: CharacterStats
}

interface CharacterInput {
    name?: string
    inventory: Array<string | null>
    equipmentSlots?: Partial<Record<EquipmentSlot, string>>
    portraitSpriteId: string
    stats: CharacterStatsInput
}

class Character {
    data: CharacterData
    attackCooldown: number
    constructor(input: CharacterInput, itemTypeRecord: Record<string, ItemType>) {
        const equipmentSlots = Character.emptyEquipmentSlots();

        const makeItem = makeItemFunction(itemTypeRecord)

        Object.entries(input.equipmentSlots ?? {}).forEach(([key, itemTypeId]) => {
            equipmentSlots.set(key, makeItem(itemTypeId))
        })

        const inventory: Array<Item | null> = input.inventory.map(typeId => makeItem(typeId))

        this.data = {
            ...input,
            inventory,
            equipmentSlots,
            stats: new CharacterStats(input.stats)
        }
        this.attackCooldown = 0
    }

    serialise(): CharacterInput {
        const equipmentSlots: CharacterInput['equipmentSlots'] = {}
        this.data.equipmentSlots?.forEach((itemOrNull, key) => {
            equipmentSlots[key as EquipmentSlot] = itemOrNull?.itemType.id ?? undefined
        })
        const inventory = this.data.inventory.map((itemOrNull) => itemOrNull?.itemType.id ?? null)

        return {
            ...this.data,
            equipmentSlots,
            inventory,
            stats: this.data.stats.serialise(),
        }
    }

    static emptyEquipmentSlots(): Map<string, Item | null> {
        return new Map<string, Item | null>()
            .set("HEAD", null)
            .set("TORSO", null)
            .set("LEGS", null)
            .set("FEET", null)
            .set("RIGHT_HAND", null)
            .set("LEFT_HAND", null)
    }

    get attackOptions(): AttackOption[] {

        const item = this.data.equipmentSlots?.get("RIGHT_HAND");

        if (item && item.itemType.isWieldable) {
            return item.itemType.data.wieldable?.attackOptions || []
        }

        return AttackOption.unarmedAttacks
    }


    get canAct(): boolean {
        if (this.data.stats.isDead) { return false }
        return true
    }

    get encumberance(): number {
        let amount = 0
        this.data.equipmentSlots?.forEach(item => {
            if (!item) { return }
            amount += item.itemType.data.equipable?.encumberance || 0
        })
        return amount;
    }

    tick(game: Game): void {

        if (!this.canAct) {
            if (game.activeCharacter == this) {
                game.activeCharacter = game.getRandomLivingCharacter()
            }
            return
        }

        if (game.tickCount % 20 == 0) {
            this.data.stats.stamina.up(1)
        }
        if (this.attackCooldown > 0 && game.tickCount % 5 == 0) {
            this.attackCooldown--
        }
    }

    attack(monster: Monster | null, option: AttackOption, game: Game): FeedbackToUI {
        if (!this.canAct) {
            return new FeedbackToUI({
                success: false,
                message: `${this.data.name} cannot attak!`
            })
        }

        const { staminaCost: baseStaminaCost, damage, name: attackName, cooldown } = option.data;

        const { encumberance } = this;
        const totalStaminaCost = baseStaminaCost + encumberance;

        if (this.data.stats.stamina.current < totalStaminaCost) {
            return new FeedbackToUI({
                success: false,
                message: `${this.data.name} is too exhausted to ${attackName}!`
            })
        }
        if (this.attackCooldown > 0) {
            return new FeedbackToUI({
                success: false,
                message: `${this.data.name} is on cooldown`
            })
        }

        this.attackCooldown = cooldown;
        this.data.stats.stamina.down(totalStaminaCost);

        if (!monster) {
            return new FeedbackToUI({
                success: false,
                message: `${this.data.name} attacked the air or a wall with a ${attackName}!`
            })
        }

        // to do: to hit rolls
        const hit = Math.random() > .3
        if (!hit) {
            return new FeedbackToUI({
                success: false,
                message: `${this.data.name} failed to hit ${monster.data.spriteId} with a ${attackName}!`
            })
        }

        monster.takeDamage(damage, game);

        return new FeedbackToUI({
            success: false,
            message: `${this.data.name} hit ${monster.data.spriteId} with a ${attackName}, doing ${damage} damage!`,
            propertyList: [
                ['damage', damage]
            ]
        })
    }

    getMyColor(game: Game): Color {
        if (game.data.characters.indexOf(this) == -1) { return Color.TRANSPARENT }
        return Game.CHARACTER_COLORS[game.data.characters.indexOf(this)]
    }

    takeDamage(amount: number): number {
        return this.data.stats.health.down(amount);
    }

    beHealed(amount: number): number {
        if (this.data.stats.isDead) { return 0 }
        return this.data.stats.health.up(amount)
    }

    say(message: string, game: Game): void {
        game.addMessage({
            content: `${this.data.name || "NAMELESS_CHARACTER"}: "${message}"`,
            color: this.getMyColor(game),
            character: this
        })
    }

    consume(item: Item, game: Game): FeedbackToUI {
        if (!this.canAct) {
            return new FeedbackToUI({ message: `${this.data.name} cannot eat!` })
        }
        if (!item.itemType.data.consumable) {
            this.say(`I want to eat this ${item.itemType.name}, but I cannot!`, game);
            return new FeedbackToUI({ message: `${item.itemType.name} is not consumable!` })
        }
        if (item.itemType.data.consumable.remains) {
            this.say(`*eats*`, game);
            game.data.itemInHand = Item.ofType(item.itemType.data.consumable.remains)
        } else {
            game.data.itemInHand = undefined
        }

        return new FeedbackToUI({ message: `nutrition was ${item.itemType.data.consumable.nutrition}!` })
    }

    equip(slotName: string, itemInHand: Item | undefined, game: Game): FeedbackToUI {
        const { equipmentSlots } = this.data

        if (!equipmentSlots || !equipmentSlots.has(slotName)) {
            console.warn('UI looking for nonexistant equipment slot', slotName)
            return FeedbackToUI.empty
        }

        const currentEquipment = equipmentSlots.get(slotName);

        if (itemInHand) {
            const isHandSlot = slotName.indexOf('HAND') != -1;
            const canEquipInSlot = isHandSlot || itemInHand.itemType.data.equipable?.slotName === slotName;
            if (canEquipInSlot) {
                game.data.itemInHand = currentEquipment || undefined
                this.data.equipmentSlots?.set(slotName, itemInHand)
                return FeedbackToUI.yes
            } else {
                return FeedbackToUI.no
            }
        }

        if (currentEquipment) {
            game.data.itemInHand = currentEquipment
            this.data.equipmentSlots?.set(slotName, null)
            return FeedbackToUI.yes
        }
        return FeedbackToUI.empty
    }

    throw(item: Item, clickPoint: { x: number; y: number; }, playerVantage: PlayerVantage, game: Game): void {
        if (!this.canAct) { return }
        item.launch(clickPoint, playerVantage, game);
        this.say(`I threw the ${item.itemType.name}`, game)
    }

}

export { Character, CharacterData, CharacterInput };

