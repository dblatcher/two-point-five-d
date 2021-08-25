import { Color } from "@/canvas/Color";
import { Sprite } from "@/canvas/Sprite";
import { FeedbackToUI, Game } from "../game-classes/Game";
import { Item } from "../game-classes/Item";
import { NarrativeMessage } from "../game-classes/NarrativeMessage";
import { PlayerVantage } from "../game-classes/PlayerVantage";
import { RelativeDirection } from "../game-classes/RelativeDirection";
import { AttackOption } from "./AttackOption";

import { CharacterStats } from "./CharacterStats"
import { Monster } from "./Monster";

interface CharacterConfig {
    name?: string
    inventory: Array<Item | null>
    equipmentSlots?: Map<string, Item | null>
    portrait: Sprite
    stats: CharacterStats
}

class Character {

    data: CharacterConfig
    attackCooldown: number
    constructor(config: CharacterConfig) {
        this.data = config
        this.attackCooldown = 0
    }

    tick(game: Game): void {
        if (game.tickCount % 20 == 0) {
            this.data.stats.stamina.up(1)
        }
        if (this.attackCooldown > 0 && game.tickCount % 5 == 0) {
            this.attackCooldown--
        }
    }

    attack(monster: Monster | null, option: AttackOption, game: Game): FeedbackToUI {
        const { staminaCost, damage, name: attackName, cooldown } = option.data;

        if (this.data.stats.stamina.current < staminaCost) {
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
        this.data.stats.stamina.down(staminaCost);

        if (!monster) {
            return new FeedbackToUI({
                success: false,
                message: `${this.data.name} attacked the air or a wall with a ${attackName}!`
            })
        }

        // to do: to hit rolls
        const hit = Math.random() > .3
        if (!hit) {
            this.say("I missed!", game)
            return new FeedbackToUI({
                success: false,
                message: `${this.data.name} failed to hit ${monster.data.sprite.name} with a ${attackName}!`
            })
        }

        monster.damage(damage, game);
        this.say("I hit it!", game)
        return new FeedbackToUI({
            success: false,
            message: `${this.data.name} hit ${monster.data.sprite.name} with a ${attackName}, doing ${damage} damage!`,
            propertyList: [
                ['damage', damage]
            ]
        })
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

    get portraitSrc(): string | null {
        return this.data.portrait.provideSrc(Sprite.defaultPortraitAnimation)
    }

    get icon(): CanvasImageSource {
        try {
            return this.data.portrait.provideImage(Sprite.defaultPortraitAnimation, RelativeDirection.BACK, 0)
        } catch (error) {
            console.warn(error.message)
        }
        return document.createElement('img');
    }

    get attackOptions(): AttackOption[] {

        const item = this.data.equipmentSlots?.get("RIGHT_HAND");

        if (item && item.data.type.isWieldable) {
            return item.data.type.data.wieldable?.attackOptions || []
        }

        return AttackOption.unarmedAttacks
    }

    drawAsIcon(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) { return }
        const height = Number(canvas.getAttribute('height') || "100");
        const width = Number(canvas.getAttribute('width') || "100");
        const { icon } = this
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(icon, 0, 0, width, height)
    }

    static clearIcon(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) { return }
        const height = Number(canvas.getAttribute('height') || "100");
        const width = Number(canvas.getAttribute('width') || "100");
        ctx.clearRect(0, 0, width, height)
    }


    getMyColor(game: Game): Color {
        if (game.data.characters.indexOf(this) == -1) { return Color.BLACK }
        return Game.CHARACTER_COLORS[game.data.characters.indexOf(this)]
    }

    damage(amount: number): number {
        return this.data.stats.health.down(amount);
    }

    say(message: string, game: Game): void {

        game.narrativeMessages.push(new NarrativeMessage({
            content: `${this.data.name || "NAMELESS_CHARACTER"}: "${message}"`,
            color: this.getMyColor(game),
            character: this,
        }))

    }

    consume(item: Item, game: Game): FeedbackToUI {
        if (!item.data.type.data.consumable) {
            this.say(`I want to eat this ${item.data.type.name}, but I cannot!`, game);
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
            const isHandSlot = slotName.indexOf('HAND') != -1;
            const canEquipInSlot = isHandSlot || itemInHand.data.type.data.equipable?.slotName === slotName;
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
        item.launch(clickPoint, playerVantage, game);
        this.say(`I threw the ${item.data.type.name}`, game)
    }

}

export { Character, CharacterConfig }