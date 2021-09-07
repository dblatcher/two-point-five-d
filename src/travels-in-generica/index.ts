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
    description:"The dead have risen in the church crypt. Rather embarassing, actually. Please put them to rest by smashing their bones.",
    acceptMessage: "Thank you - here is the key to the crypt. The stairs down are behind the door over there.",
    refuseMessage: "Oh well... maybe someone braver will come along. hopefully before the bishop's inspection.",
    itemsGivenOnAccept: [
        itemTypes.key,
        itemTypes.apple,
    ],
    goals: [
        new QuestGoal({
            narrative: "kill everything in level two",
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
}, {
    needCharacterToPickUpItems: true,
    playerBlocksPassage: true,
})

export { game, spriteSheets }
