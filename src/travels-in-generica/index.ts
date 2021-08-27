import { Game } from "@/game-classes/Game";
import { Direction } from "@/game-classes/Direction";
import { PlayerVantage } from "@/game-classes/PlayerVantage";

import { level1 } from "./level1"
import { level2 } from "./level2"
import { characters } from "./characters";
import { spriteSheets as sharedSheets } from "@/instances/sprites";
import { spriteSheets as localSheets } from "./sprites";

const spriteSheets = [
    ...sharedSheets,
    ...localSheets,
]

const levels = [
    level1, level2
]

const game = new Game({
    level: levels[0],
    levels: levels,
    playerVantage: new PlayerVantage(levels[0].data.startingVantage || { x: 0, y: 0, direction: Direction.south }),
    controllers: [],
    activeCharacterIndex: 0,
    characters: [characters.sally, characters.boblin, characters.drake, characters.gwim],
}, {
    needCharacterToPickUpItems: true,
    playerBlocksPassage: true,
})

export { game, spriteSheets }
