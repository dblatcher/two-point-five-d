
import { Game } from "@/game-classes/Game";
import { Direction } from "@/game-classes/Direction";
import { PlayerVantage } from "@/game-classes/PlayerVantage";

import {duckPuzzleLevel1, duckPuzzleLevel2, duckPuzzleLevel3} from "./levels"
import { spriteSheets as sharedSheets } from "@/instances/sprites";
import { spriteSheets as localSheets } from "./sprites";

const spriteSheets = [
    ...sharedSheets,
    ...localSheets,
];

const levels = [
    duckPuzzleLevel1,
    duckPuzzleLevel2,
    duckPuzzleLevel3
]

const game = new Game({
    level: levels[0],
    levels: levels,
    playerVantage: new PlayerVantage(levels[0].data.startingVantage || { x: 0, y: 0, direction: Direction.south }),
    controllers:[],
    activeCharacterIndex: 0,
    characters: [],
}, {
    needCharacterToPickUpItems: false
})

export { game, spriteSheets }
