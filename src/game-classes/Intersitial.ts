import { Direction } from "./Direction";
import { Game } from "./Game"
import { PlayerVantage } from "./PlayerVantage";
import { Vantage } from "./Vantage";

interface IntersitialOptionFunction {
    (game: Game): void
}


interface IntersitialData {
    role: "END_OF_LEVEL" | "MESSAGE"
    content: string
    options: { buttonText: string, response: IntersitialOptionFunction }[]
}


class Intersitial {
    data: IntersitialData

    constructor(config: IntersitialData) {
        this.data = config
    }

    static goToNextLevel(game: Game): void {
        const levelIndex = game.data.levels.indexOf(game.data.level);
        const nextLevel = game.data.levels[levelIndex + 1]
        game.changeLevel(levelIndex + 1, new PlayerVantage(nextLevel.data.startingVantage || { x: 0, y: 0, direction: Direction.south }))
    }
}

export { Intersitial, IntersitialData, IntersitialOptionFunction }