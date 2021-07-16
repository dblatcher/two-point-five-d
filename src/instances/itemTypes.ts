import { Color } from "@/canvas/Color";
import { ItemType } from "@/game-classes/ItemType";
import { sprites } from "./sprites";


const apple = new ItemType({
    name: "apple", sprite: sprites.apple, figureDimensions: { height: .2, width: .2 },
    consumable: { nutrition: 5, }
})

const key = new ItemType({
    name: "key", sprite: sprites.key, figureDimensions: { height: .2, width: .2 },
})

const bean = new ItemType({
    name: "bean", sprite: sprites.bean, figureDimensions: { height: .2, width: .2 },
    backgroundColor: new Color(40, 50, 120),
    consumable: { nutrition: 5, remains: key }
})

const itemTypes = {
    apple,
    bean,
    key,
}

export {
    itemTypes
}