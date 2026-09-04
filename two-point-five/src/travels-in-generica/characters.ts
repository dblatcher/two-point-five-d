import { Item } from '@/game-classes/Item';
import { Character } from '@/rpg-classes/Character';
import { itemTypes } from './itemTypes';
import { sprites } from './sprites';

const boblin = new Character({
    name: "Boblin",
    stats: { health: [10, 12], stamina: [2, 20], mana: [5, 5] },
    portraitSpriteId: sprites.boblin_portrait.id,
    inventory: [
        null, null,
        Item.ofType(itemTypes.apple), null,
        null, Item.ofType(itemTypes.bean),
        null, null,
        null, null,
    ],
    equipmentSlots: {
        "HEAD": Item.ofType(itemTypes.bardHat),
        "RIGHT_HAND": Item.ofType(itemTypes.stick)
    }

});

const drake = new Character({
    name: "Drake",
    stats: { health: [12, 15], stamina: [15, 15], mana: [0, 0] },
    portraitSpriteId: sprites.drake_portrait.id,
    inventory: [
        null, null,
        null, Item.ofType(itemTypes.plateArmour),
        null, null,
        null, null,
        null, null,
    ],
    equipmentSlots: {
        "RIGHT_HAND": Item.ofType(itemTypes.hammer),
        "TORSO": Item.ofType(itemTypes.mailShirt)
    }
});

const sally = new Character({
    name: "Sally",
    portraitSpriteId: sprites.sally_portrait.id,
    stats: { health: [10, 18], stamina: [20, 20], mana: [0, 0] },
    inventory: [
        null, null,
        null, null,
        null, null,
        null, null,
        null, null,
    ],
    equipmentSlots: {
        "HEAD": Item.ofType(itemTypes.helmet),
        "RIGHT_HAND": Item.ofType(itemTypes.stick)
    }
});

const gwim = new Character({
    name: "Gwimin",
    portraitSpriteId: sprites.gwim_portrait.id,
    stats: { health: [10, 10], stamina: [10, 10], mana: [10, 20] },
    inventory: [
        null, null,
        null, null,
        null, null,
        null, null,
        null, null,
    ],
   equipmentSlots: {
        "HEAD": Item.ofType(itemTypes.bardHat),
    }
});

const characters = {
    boblin, drake, sally, gwim
}

export { characters };
