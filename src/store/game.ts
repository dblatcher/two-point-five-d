import { level, playerCharacter } from './levels'

import { Game } from '../game-classes/Game'

const game = new Game({
    level, playerCharacter,
})

export { game }