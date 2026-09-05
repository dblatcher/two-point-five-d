import { CharacterInput } from '@/rpg-classes/Character';
import { itemTypes } from './itemTypes';
import { sprites } from './sprites';

const boblin: CharacterInput = {
    name: "Boblin",
    stats: { health: [10, 12], stamina: [2, 20], mana: [5, 5] },
    portraitSpriteId: sprites.boblin_portrait.id,
    inventory: [
        null, null,
        (itemTypes.apple.id), null,
        null, (itemTypes.bean.id),
        null, null,
        null, null,
    ],
    equipmentSlots: {
        "HEAD": (itemTypes.bardHat.id),
        "RIGHT_HAND": (itemTypes.stick.id)
    }
};

const drake: CharacterInput = {
    name: "Drake",
    stats: { health: [12, 15], stamina: [15, 15], mana: [0, 0] },
    portraitSpriteId: sprites.drake_portrait.id,
    inventory: [
        null, null,
        null, (itemTypes.plateArmour.id),
        null, null,
        null, null,
        null, null,
    ],
    equipmentSlots: {
        "RIGHT_HAND": (itemTypes.hammer.id),
        "TORSO": (itemTypes.mailShirt.id)
    }
};

const sally: CharacterInput = {
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
        "HEAD": (itemTypes.helmet.id),
        "RIGHT_HAND": (itemTypes.stick.id)
    }
};

const gwim: CharacterInput = {
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
        "HEAD": (itemTypes.bardHat.id),
    }
};

const characters = {
    boblin, drake, sally, gwim
}

export { characters };

