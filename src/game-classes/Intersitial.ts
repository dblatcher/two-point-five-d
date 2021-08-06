import { Game } from "./Game"

interface IntersitialOptionFunction {
    (game: Game): void
}


interface IntersitialData {
    role: "END_OF_LEVEL" | "MESSAGE"
    content: string
    options: {buttonText:string, response:IntersitialOptionFunction}[]
}


class Intersitial {
    data: IntersitialData

    constructor(config: IntersitialData) {
        this.data = config
    }
}

export { Intersitial, IntersitialData, IntersitialOptionFunction }