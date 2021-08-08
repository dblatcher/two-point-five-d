import { playerVantage, controllers } from './levels'

import { Game } from '../game-classes/Game'
import { duckPuzzleLevel, duckPuzzleLevel2, duckPuzzleLevel3 } from './duckPuzzle'
import { PlayerVantage } from '@/game-classes/PlayerVantage'


const levels = [duckPuzzleLevel, duckPuzzleLevel2, duckPuzzleLevel3]

const game = new Game({
    level: levels[0],
    levels: levels,
    playerVantage: levels[0].data.startingVantage ? new PlayerVantage(levels[0].data.startingVantage) : playerVantage,
    controllers,
    activeCharacterIndex: 0,
    characters: [],
}, {
    needCharacterToPickUpItems: false
})

export { game }