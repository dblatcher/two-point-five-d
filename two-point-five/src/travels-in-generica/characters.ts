import { Character } from '@/rpg-classes/Character';
import { itemTypes } from './itemTypes';
import { Item } from '@/game-classes/Item';
import { sprites } from './sprites';
import { CharacterStats } from '@/rpg-classes/CharacterStats';

const boblin = new Character({
    name: "Boblin",
    stats: new CharacterStats([10, 12], [2, 20], [5, 5]),
    portraitSpriteId: sprites.boblin_portrait.id,
    inventory: [
        null, null,
        Item.ofType(itemTypes.apple), null,
        null, Item.ofType(itemTypes.bean),
        null, null,
        null, null,
    ],
    equipmentSlots: Character.emptyEquipmentSlots()
        .set("HEAD", Item.ofType(itemTypes.bardHat))
        .set("RIGHT_HAND", Item.ofType(itemTypes.stick)),

});

const drake = new Character({
    name: "Drake",
    stats: new CharacterStats([12, 15], [15, 15], [0, 0]),
    portraitSpriteId: sprites.drake_portrait.id,
    inventory: [
        null, null,
        null, Item.ofType(itemTypes.plateArmour),
        null, null,
        null, null,
        null, null,
    ],
    equipmentSlots: Character.emptyEquipmentSlots()
        .set("RIGHT_HAND", Item.ofType(itemTypes.hammer))
        .set("TORSO", Item.ofType(itemTypes.mailShirt))
    ,
});

const sally = new Character({
    name: "Sally",
    portraitSpriteId: sprites.sally_portrait.id,
    stats: new CharacterStats([10, 18], [20, 20], [0, 0]),
    inventory: [
        null, null,
        null, null,
        null, null,
        null, null,
        null, null,
    ],
    equipmentSlots: Character.emptyEquipmentSlots()
        .set("HEAD", Item.ofType(itemTypes.helmet))
});

const gwim = new Character({
    name: "Gwimin",
    portraitSpriteId: sprites.gwim_portrait.id,
    stats: new CharacterStats([10, 10], [10, 10], [10, 20]),
    inventory: [
        null, null,
        null, null,
        null, null,
        null, null,
        null, null,
    ],
    equipmentSlots: Character.emptyEquipmentSlots()
        .set("HEAD", Item.ofType(itemTypes.helmet))
});

const characters = {
    boblin, drake, sally, gwim
}

export { characters }