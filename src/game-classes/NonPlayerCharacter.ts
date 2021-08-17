import { Dimensions, Point } from "@/canvas/canvas-utility"
import { Sprite, SpriteConfig } from "@/canvas/Sprite"
import { Behaviour } from "@/game-classes/Behaviour"
import { Figure } from "@/game-classes/Figure"
import { Game } from "@/game-classes/Game"
import { RelativeDirection } from "@/game-classes/RelativeDirection"
import { Vantage } from "@/game-classes/Vantage"

interface NonPlayerCharacterData {
    vantage?: Vantage
    sprite: Sprite
    animation?: string
    behaviour?: Behaviour
    height?: number
    width?: number
}

class NonPlayerCharacter {
    data: NonPlayerCharacterData


    constructor(data: NonPlayerCharacterData) {
        this.data = data
    }

    get figure(): Figure | null {
        const { vantage, sprite, animation = Sprite.defaultFigureAnimation, height = 1, width = 1 } = this.data
        if (vantage) {
            return new Figure({
                sprite, ...vantage.data,
                initialAnimation: animation,
                height, width
            })
        }
        return null
    }

    move(relativeDirection: RelativeDirection, game: Game): void {
        return this.data.vantage?.move(relativeDirection, game)
    }
    shiftWithinSquare(point: Point, game: Game): void {
        return this.data.vantage?.shiftWithinSquare(point, game)
    }
    turn(relativeDirection: RelativeDirection): void {
        return this.data.vantage?.turn(relativeDirection)
    }
    moveBy(distance: number, relativeDirection: RelativeDirection, game: Game): void {
        return this.data.vantage?.moveBy(distance, relativeDirection, game)
    }
}


export {
    NonPlayerCharacter
}