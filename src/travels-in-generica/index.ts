
import { Game } from "@/game-classes/Game";
import { Direction } from "@/game-classes/Direction";
import { PlayerVantage } from "@/game-classes/PlayerVantage";

import { level1, controllers, level2 } from "./levels"
import { characters } from "./characters";

const levels = [
    level1, level2
]

const game = new Game({
    level: levels[0],
    levels: levels,
    playerVantage: new PlayerVantage(levels[0].data.startingVantage || { x: 0, y: 0, direction: Direction.south }),
    controllers: controllers,
    activeCharacterIndex: 0,
    characters: [characters.sally, characters.boblin, characters.drake, characters.gwim],
}, {
    needCharacterToPickUpItems: false
})

export { game }
