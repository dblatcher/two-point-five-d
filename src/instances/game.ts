import { level1, level2, playerVantage, controllers } from './levels'

import { Game } from '../game-classes/Game'
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
    equipmentSlots: new Map<string, Item | null>()
        .set("HEAD", new Item({ type: itemTypes.bardHat }))
        .set("TORSO", null)
        .set("LEGS", null)
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
    equipmentSlots: new Map<string, Item | null>()
        .set("HEAD", null)
        .set("TORSO", null)
        .set("LEGS", null)
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
    equipmentSlots: new Map<string, Item | null>()
        .set("HEAD", new Item({ type: itemTypes.helmet }))
        .set("TORSO", null)
        .set("LEGS", null)
});

const game = new Game({
    level: level1,
    levels: [level1, level2],
    playerVantage,
    controllers,
    characters: [drake, boblin, sally],
})

export { game }