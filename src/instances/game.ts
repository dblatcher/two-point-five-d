import { level1, level2, playerCharacter } from './levels'

import { Game } from '../game-classes/Game'

const game = new Game({
    level: level1,
    levels: [level1, level2],
    playerCharacter,
})

export { game }