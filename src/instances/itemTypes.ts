import { ItemType } from "@/game-classes/Item";
import { sprites } from "./sprites";

const appleType: ItemType = { description: "apple", sprite: sprites.apple, figureDimensions: { height: .2, width: .2 } };
const beanType: ItemType = { description: "bean", sprite: sprites.bean, figureDimensions: { height: .2, width: .2 } };
const keyType: ItemType = { description: "key", sprite: sprites.key, figureDimensions: { height: .2, width: .2 } };


const itemTypes = {
    apple: appleType,
    bean: beanType,
    key: keyType
}

export {
    itemTypes
}