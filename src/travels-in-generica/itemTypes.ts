import { Color } from "@/canvas/Color";
import { ItemType } from "@/game-classes/ItemType";
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
    equipable: {slotName:'HEAD'},
    weight: 3,
})

const bardHat = new ItemType({
    name: "bard's hat", sprite: commonSprites.bardHat, figureDimensions: { height: .2, width: .25 },
    equipable: {slotName:'HEAD'},
    weight: 1,
})

const silverSword = new ItemType({
    name: "silver sword", sprite: sprites.silverSword, figureDimensions: { height: .2, width: .25 },
    weight: 3,
})

const hammer = new ItemType({
    name: "hammer", sprite: sprites.hammer, figureDimensions: { height: .2, width: .25 },
    weight: 4,
})

const stick = new ItemType({
    name: "stick", sprite: sprites.stick, figureDimensions: { height: .2, width: .25 },
    weight: 2,
})

const itemTypes = {
    apple,
    bean,
    key,
    helmet, bardHat,
    silverSword, hammer, stick
}

export {
    itemTypes
}