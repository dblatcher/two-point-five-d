import { level1, level2,duckPuzzleLevel, playerVantage, controllers } from './levels'

import { Game } from '../game-classes/Game'
import { characters } from './characters'


const game = new Game({
    level: duckPuzzleLevel,
    levels: [duckPuzzleLevel, level1, level2],
    playerVantage: duckPuzzleLevel.data.startingVantage || playerVantage,
    controllers,
    activeCharacterIndex: 0,
    characters: [characters.drake, characters.boblin, characters.sally],
})

export { game }