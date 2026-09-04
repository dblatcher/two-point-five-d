import { Color } from "@/canvas/Color";
import { ItemType } from "@/game-classes/ItemType";
import { sprites } from "./sprites";


const apple = new ItemType({
    id: "apple", sprite: sprites.apple, figureDimensions: { height: .2, width: .2 },
    consumable: { nutrition: 5, }
})

const key = new ItemType({
    id: "key", sprite: sprites.key, figureDimensions: { height: .2, width: .2 },
})

const bean = new ItemType({
    id: "bean", sprite: sprites.bean, figureDimensions: { height: .2, width: .2 },
    backgroundColor: new Color(40, 50, 120),
    consumable: { nutrition: 5, remains: key }
})

const helmet = new ItemType({
    id: "helmet", sprite: sprites.helmet, figureDimensions: { height: .225, width: .18 },
    equipable: { slotName: 'HEAD' },
    weight: 3,
})

const bardHat = new ItemType({
    id: 'bardHat',
    name: "bard's hat", sprite: sprites.bardHat, figureDimensions: { height: .2, width: .25 },
    equipable: { slotName: 'HEAD' },
    weight: 1,
})

const itemTypes = {
    apple,
    bean,
    key,
    helmet, bardHat
}

export {
    itemTypes
}