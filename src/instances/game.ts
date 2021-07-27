import { level1, level2, playerVantage, controllers } from './levels'

import { Game } from '../game-classes/Game'
import { characters } from './characters'



const game = new Game({
    level: level1,
    levels: [level1, level2],
    playerVantage,
    controllers,
    characters: [characters.drake, characters.boblin, characters.sally],
})

export { game }