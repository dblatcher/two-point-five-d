import { Character } from '@/rpg-classes/Character';
import { itemTypes } from '../instances/itemTypes';
import { Item } from '@/game-classes/Item';
import { sprites } from './sprites';
import { CharacterStats } from '@/rpg-classes/CharacterStats';

const boblin = new Character({
    name: "Boblin",
    stats: new CharacterStats([10,12],[20,20],[5,5]),
    portrait: sprites.boblin_portrait,
    inventory: [
        null, null,
        new Item({ type: itemTypes.apple, }), null,
        null, new Item({ type: itemTypes.bean }),
        null, null,
        null, null,
    ],
    equipmentSlots: Character.emptyEquipmentSlots()
        .set("HEAD", new Item({ type: itemTypes.bardHat })),
});

const drake = new Character({
    name: "Drake",
    stats: new CharacterStats([12,15],[15,15],[0,0]),
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
    stats: new CharacterStats([10,18],[20,20],[0,0]),
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

const gwim = new Character({
    name: "Gwimin",
    portrait: sprites.gwim_portrait,
    stats: new CharacterStats([10,10],[10,10],[10,20]),
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
    boblin,drake,sally,gwim
}

export {characters}