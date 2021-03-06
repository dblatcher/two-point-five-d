import { Point } from "@/canvas/canvas-utility"
import { Sprite } from "@/canvas/Sprite"
import { Behaviour } from "@/game-classes/Behaviour"
import { Figure } from "@/game-classes/Figure"
import { Game } from "@/game-classes/Game"
import { RelativeDirection } from "@/game-classes/RelativeDirection"
import { Vantage } from "@/game-classes/Vantage"
import { Action, DoAction } from "./Action"
import { Item } from "./Item"
import { Blockage } from "./Level"

interface ActorData {
    vantage?: Vantage
    sprite: Sprite
    behaviour?: Behaviour
    height?: number
    width?: number
    blocksSquare?: boolean
    canInteractWith?: boolean
}

class Actor {
    data: ActorData
    actionQueue: Action[]
    currentAction: Action | undefined
    get isMonster(): boolean { return false }

    static MAX_QUEUE_LENGTH = 10

    constructor(data: ActorData) {
        this.data = data
        this.actionQueue = []
        this.currentAction = undefined
    }

    get figure(): Figure | null {
        const { vantage, sprite, height = 1, width = 1 } = this.data
        if (vantage) {
            return new Figure({
                sprite, ...vantage.data,
                initialAnimation: this.animation,
                height, width, transitionPhase: this.transitionPhase
            })
        }
        return null
    }

    get animation(): string {
        if (!this.currentAction) { return Sprite.defaultFigureAnimation }
        if (this.currentAction.action == "MOVEBY" || this.currentAction.action == "WALK_FORWARD") { return 'WALK' }
        if (this.currentAction.action == "DO") {
            const doAction = (this.currentAction as DoAction);
            if (this.data.sprite.keyArray.some(animationKey => animationKey.indexOf(doAction.animation) != -1)) {
                return (this.currentAction as DoAction).animation
            }

        }
        return Sprite.defaultFigureAnimation
    }

    get transitionPhase(): number | undefined {
        if (this.currentAction?.action == "DO") {
            const doAction = (this.currentAction as DoAction);
            return (doAction.tickCount + 1) / doAction.duration
        }
        return undefined
    }

    tick(game: Game): void {

        if (this.data.behaviour && (this.actionQueue.length < Actor.MAX_QUEUE_LENGTH)) {
            const action = this.data.behaviour.decideAction(this, game)
            if (action) { this.actionQueue.push(action) }
        }

        if (this.currentAction) {
            this.currentAction.tickCount++
            this.currentAction.onContinue(this, game)
            if (this.currentAction.isFinished) {
                if (this.currentAction.somethingHappensOnFinish) {
                    this.currentAction.onFinish(this, game);
                }
                this.currentAction = undefined
            }
        }


        if (!this.currentAction) {
            this.currentAction = this.actionQueue.shift();
            if (this.currentAction) {
                this.currentAction.start(this, game);
            }
        }

    }

    handleInteraction(actor: Vantage | Actor, game: Game): void {
        console.log('handleInteraction', game.tickCount)
    }

    handleBeingHitByFlyingItem(item:Item, game:Game):void {
        console.log(`${this.data.sprite.name} was hit by a ${item.data.type.name} going ${item.data.vantage?.data.direction.name}.`)
    }

    move(relativeDirection: RelativeDirection, game: Game): Blockage | undefined {
        return this.data.vantage?.move(relativeDirection, game)
    }
    shiftWithinSquare(point: Point, game: Game): void {
        return this.data.vantage?.shiftWithinSquare(point, game)
    }
    turn(relativeDirection: RelativeDirection): void {
        return this.data.vantage?.turn(relativeDirection)
    }
    moveBy(distance: number, relativeDirection: RelativeDirection, game: Game): Blockage | undefined {
        return this.data.vantage?.moveBy(distance, relativeDirection, game)
    }
}


export {
    Actor
}