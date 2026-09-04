import { Game } from "@/game-classes/Game";
import { PlayerVantage } from "@/game-classes/PlayerVantage";

import { spriteSheets as sharedSheets, sprites as sharedSprites } from "@/instances/sprites";
import { Quest, QuestGoal } from "@/rpg-classes/Quest";
import { characters } from "./characters";
import { itemTypes } from "./itemTypes";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { spriteSheets as localSheets, sprites } from "./sprites";

const spriteSheets = [
    ...sharedSheets,
    ...localSheets,
]

const levels = [
    level1,
    level2,
]


const questOne = new Quest({
    id: 'questOne',
    state: 'NOT_TAKEN',
    title: "Purge the crypt",
    description: "clear the crypt of Saint Bernard's chapel of undead and report back to Father Dunlaw.",
    itemsGivenOnAccept: [
        itemTypes.key,
        itemTypes.apple,
    ],
    itemsGivenOnComplete: [
        itemTypes.silverSword
    ],
    goals: [
        new QuestGoal({
            narrative: "destroy skeletons",
            allMonstersKilled: level2
        }),
    ]
})

const game = new Game({
    level: levels[0],
    levels: levels,
    playerVantage: new PlayerVantage(levels[0].data.startingVantage || { x: 0, y: 0, direction: 'SOUTH' }),
    controllers: [],
    activeCharacterIndex: 0,
    quests: [
        questOne
    ],
    characters: [characters.sally, characters.boblin, characters.drake, characters.gwim],
    narrativeMessages: [],
}, {
    spriteSheets,
    sprites: [
        ...Object.values(sharedSprites).map(sprite => sprite.data),
        ...Object.values(sprites).map(sprite => sprite.data)
    ],
}, {
    needCharacterToPickUpItems: true,
    playerBlocksPassage: true,
})

export { game, spriteSheets };

