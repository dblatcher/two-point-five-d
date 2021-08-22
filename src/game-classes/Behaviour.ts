import { Game } from './Game';
import { Action, MovementAction, MovementByAction, ShiftAction } from './Action';
import { RelativeDirection } from './RelativeDirection';
import { Actor } from '@/game-classes/Actor';



interface DecisionFunction {
    (actor: Actor, game: Game, behaviour: Behaviour): Action | null
}

function moveClockwise(actor: Actor, game: Game, behaviour: Behaviour): Action|null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const distanceToMove = .05
    const howCloseToGet = .5
    const whereToLookForBlockage = vantage.translate({
        x: vantage.data.direction.x * howCloseToGet,
        y: vantage.data.direction.y * howCloseToGet,
    })

    if (game.data.level.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor)) {
        return new MovementAction("TURN", RelativeDirection.RIGHT)
    } else {
        return new MovementByAction(distanceToMove, RelativeDirection.FORWARD)
    }
}

function moveAntiClockwise(actor: Actor, game: Game, behaviour: Behaviour): Action|null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const distanceToMove = .05
    const howCloseToGet = .5
    const whereToLookForBlockage = vantage.translate({
        x: vantage.data.direction.x * howCloseToGet,
        y: vantage.data.direction.y * howCloseToGet,
    })

    if (game.data.level.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor)) {
        return new MovementAction("TURN", RelativeDirection.LEFT)
    } else {
        return new MovementByAction(distanceToMove, RelativeDirection.FORWARD)
    }
}

function moveBackAndForward(actor: Actor, game: Game, behaviour: Behaviour): Action|null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const distanceToMove = .05
    const howCloseToGet = .5
    const whereToLookForBlockage = vantage.translate({
        x: vantage.data.direction.x * howCloseToGet,
        y: vantage.data.direction.y * howCloseToGet,
    })

    if (game.data.level.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor)) {
        return new MovementAction("TURN", RelativeDirection.BACK)
    } else {
        return new MovementByAction(distanceToMove, RelativeDirection.FORWARD)
    }
}

function shiftAround(actor: Actor, game: Game, behaviour: Behaviour): Action | null {
    if (game.tickCount % 3 !== 0) { return null }
    return new ShiftAction({ x: Math.random(), y: Math.random() })
}

function wanderForward(actor: Actor, game: Game, behaviour: Behaviour): Action | null {
    if (game.tickCount % 2 !== 0) { return null }
    return new MovementByAction(.05, RelativeDirection.FORWARD)
}

const decisionFunctions = {
    moveClockwise, moveAntiClockwise, shiftAround, wanderForward, moveBackAndForward
}

class Behaviour {
    decisionFunction: DecisionFunction

    constructor(decisionFunction: DecisionFunction) {
        this.decisionFunction = decisionFunction
    }

    decideAction(actor: Actor, game: Game): Action | null {
        return this.decisionFunction(actor, game, this);
    }

}

export { Behaviour, decisionFunctions, DecisionFunction }
