import { level1, level2, playerVantage, controllers } from './levels'

import { Game } from '../game-classes/Game'
import { characters } from './characters'
import { duckPuzzleLevel, duckPuzzleLevel2 } from './duckPuzzle'


const game = new Game({
    level: duckPuzzleLevel,
    levels: [duckPuzzleLevel, duckPuzzleLevel2,],
    playerVantage: duckPuzzleLevel.data.startingVantage || playerVantage,
    controllers,
    activeCharacterIndex: 0,
    characters: [],
}, {
    needCharacterToPickUpItems: false
})

export { game }