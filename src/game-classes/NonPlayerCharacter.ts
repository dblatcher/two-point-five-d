import { Dimensions, Point } from "@/canvas/canvas-utility"
import { Sprite, SpriteConfig } from "@/canvas/Sprite"
import { Behaviour } from "@/game-classes/Behaviour"
import { Figure } from "@/game-classes/Figure"
import { Game } from "@/game-classes/Game"
import { RelativeDirection } from "@/game-classes/RelativeDirection"
import { Vantage } from "@/game-classes/Vantage"
import { Action, MovementAction } from "./Action"

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
    actionQueue: Action[]
    static MAX_QUEUE_LENGTH = 10

    constructor(data: NonPlayerCharacterData) {
        this.data = data
        this.actionQueue = []
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


    tick(game:Game):void {

        if (this.data.behaviour && (this.actionQueue.length < NonPlayerCharacter.MAX_QUEUE_LENGTH)) {
            const action = this.data.behaviour.decideAction(this, game)
            if (action) {this.actionQueue.push(action)}
        }

        const nextAction = this.actionQueue.shift();
        if (nextAction) {
            nextAction.perform(this, game);
        }

    }

    handleInteraction(actor: Vantage | NonPlayerCharacter, game: Game): void {
        console.log('handleInteraction',actor, this, game.tickCount)
        // this.actionQueue.push(new MovementAction("TURN",RelativeDirection.LEFT))
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