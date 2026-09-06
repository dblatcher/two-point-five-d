import { Game } from "@/game-classes/Game";
import { spriteSheets as sharedSheets, sprites as sharedSprites } from "@/instances/sprites";
import { QuestData } from "@/rpg-classes/Quest";
import { characters } from "./characters";
import { itemTypes } from "./itemTypes";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { spriteSheets as localSheets, sprites } from "./sprites";
import { Level } from "@/game-classes/Level";

const spriteSheets = [
    ...sharedSheets,
    ...localSheets,
]

const levels:[Level, ...Level[]] = [
    level1,
    level2,
]


const questOne: QuestData = {
    id: 'questOne',
    state: 'NOT_TAKEN',
    title: "Purge the crypt",
    description: "clear the crypt of Saint Bernard's chapel of undead and report back to Father Dunlaw.",
    itemsGivenOnAccept: [
        itemTypes.key.id,
        itemTypes.apple.id,
    ],
    itemsGivenOnComplete: [
        itemTypes.silverSword.id
    ],
    goals: [
        {
            narrative: "destroy skeletons",
            allMonstersKilled: level2.id
        },
    ]
}

const game = new Game({
    levels: levels,
    playerVantage: levels[0].data.startingVantage || { x: 0, y: 0, direction: 'SOUTH' },
    controllers: [],
    activeCharacterIndex: 0,
    quests: [
        questOne
    ],
    characters: [
        characters.sally,
        characters.boblin,
        characters.drake,
        characters.gwim,
    ],
    narrativeMessages: [],
}, {
    spriteSheets,
    sprites: [
        ...Object.values(sharedSprites).map(sprite => sprite.data),
        ...Object.values(sprites).map(sprite => sprite.data)
    ],
    itemTypeRecord: itemTypes,
}, {
    needCharacterToPickUpItems: true,
    playerBlocksPassage: true,
})

export { game, spriteSheets };

