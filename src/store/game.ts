import { level, playerVantage } from './levels'

import { Game } from '../game-classes/Game'

const game = new Game({
    level, playerVantage,
})

export { game }