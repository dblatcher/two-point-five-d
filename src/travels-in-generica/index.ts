import { Game } from "@/game-classes/Game";
import { Direction } from "@/game-classes/Direction";
import { PlayerVantage } from "@/game-classes/PlayerVantage";

import { level1 } from "./level1"
import { level2 } from "./level2"
import { characters } from "./characters";
import { spriteSheets as sharedSheets } from "@/instances/sprites";
import { spriteSheets as localSheets } from "./sprites";
import { Quest, QuestGoal } from "@/rpg-classes/Quest";
import { itemTypes } from "./itemTypes";

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
    state:'NOT_TAKEN',
    title:"Purge the crypt",
    description:"clear the crypt of Saint Bernard's chapel of undead and report back to Father Dunlaw.",
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
    playerVantage: new PlayerVantage(levels[0].data.startingVantage || { x: 0, y: 0, direction: Direction.south }),
    controllers: [],
    activeCharacterIndex: 0,
    quests:[
        questOne
    ],
    characters: [characters.sally, characters.boblin, characters.drake, characters.gwim],
    spriteSheets,
}, {
    needCharacterToPickUpItems: true,
    playerBlocksPassage: true,
})

export { game, spriteSheets }
