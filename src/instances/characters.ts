import { Character } from '@/game-classes/Character';
import { itemTypes } from './itemTypes';
import { Item } from '@/game-classes/Item';
import { sprites } from './sprites';

const boblin = new Character({
    name: "Boblin",
    portrait: sprites.boblin_portrait,
    inventory: [
        null, null,
        new Item({ type: itemTypes.apple, }), null,
        null, new Item({ type: itemTypes.bean }),
        null, null,
        null, null,
    ],
    equipmentSlots: Character.emptyEquipmentSlots()
        .set("HEAD", new Item({ type: itemTypes.bardHat }))
});

const drake = new Character({
    name: "Drake",
    portrait: sprites.drake_portrait,
    inventory: [
        null, null,
        null, null,
        null, null,
        null, null,
        null, null,
    ],
    equipmentSlots: Character.emptyEquipmentSlots()
});

const sally = new Character({
    name: "Sally",
    portrait: sprites.sally_portrait,
    inventory: [
        null, null,
        null, null,
        null, null,
        null, null,
        null, null,
    ],
    equipmentSlots: Character.emptyEquipmentSlots()
        .set("HEAD", new Item({ type: itemTypes.helmet }))
});

const characters = {
    boblin,drake,sally
}

export {characters}