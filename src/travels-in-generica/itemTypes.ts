import { Color } from "@/canvas/Color";
import { ItemType } from "@/game-classes/ItemType";
import { AttackOption } from "@/rpg-classes/AttackOption";
import { sprites as commonSprites } from "../instances/sprites";
import { sprites } from "./sprites";


const apple = new ItemType({
    name: "apple", sprite: commonSprites.apple, figureDimensions: { height: .2, width: .2 },
    consumable: { nutrition: 5, }
})

const key = new ItemType({
    name: "key", sprite: commonSprites.key, figureDimensions: { height: .2, width: .2 },
})

const bean = new ItemType({
    name: "bean", sprite: commonSprites.bean, figureDimensions: { height: .2, width: .2 },
    backgroundColor: new Color(40, 50, 120),
    consumable: { nutrition: 5, remains: key }
})

const helmet = new ItemType({
    name: "helmet", sprite: commonSprites.helmet, figureDimensions: { height: .225, width: .18 },
    equipable: { slotName: 'HEAD' },
    weight: 3,
})

const bardHat = new ItemType({
    name: "bard's hat", sprite: commonSprites.bardHat, figureDimensions: { height: .2, width: .25 },
    equipable: { slotName: 'HEAD' },
    weight: 1,
})

const mailShirt = new ItemType({
    name: "mail shirt", sprite: sprites.mailShirt,
    weight: 8,
    equipable: { slotName: 'TORSO', defenseBonus: 4, encumberance: 2 },
})

const plateArmour = new ItemType({
    name: "plate armour", sprite: sprites.plateArmour,
    weight: 14,
    equipable: { slotName: 'TORSO', defenseBonus: 6, encumberance: 3 },
})

const silverSword = new ItemType({
    name: "silver sword", sprite: sprites.silverSword, figureDimensions: { height: .2, width: .25 },
    weight: 3,
    wieldable: {
        attackOptions: [
            new AttackOption(
                { name: 'swing', damage: 4, staminaCost: 3, cooldown: 10 },
            ),
            new AttackOption(
                { name: 'stab', damage: 5, staminaCost: 2, cooldown: 14 },
            ),
        ]
    }
})

const hammer = new ItemType({
    name: "hammer", sprite: sprites.hammer, figureDimensions: { height: .2, width: .25 },
    weight: 4,
    wieldable: {
        attackOptions: [
            new AttackOption(
                { name: 'bash', damage: 5, staminaCost: 4, cooldown: 10 },
            ),
        ]
    }
})

const stick = new ItemType({
    name: "stick", sprite: sprites.stick, figureDimensions: { height: .2, width: .25 },
    weight: 2,
    wieldable: {
        attackOptions: [
            new AttackOption(
                { name: 'poke', damage: 1, staminaCost: 1, cooldown: 5 },
            ),
            new AttackOption(
                { name: 'bash', damage: 3, staminaCost: 2, cooldown: 10 },
            ),
        ]
    }
})

const itemTypes = {
    apple,
    bean,
    key,
    helmet, bardHat, mailShirt, plateArmour,
    silverSword, hammer, stick,
}

export {
    itemTypes
}