import { Game } from './Game';
import { Figure } from './Figure';
import { Action, MovementAction, MovementByAction, ShiftAction } from './Action';
import { RelativeDirection } from './RelativeDirection';



interface DecisionFunction {
    (actor: Figure, game: Game, behaviour: Behaviour): Action | null
}

function moveClockwise(actor: Figure, game: Game, behaviour: Behaviour): Action {
    const placeAhead = actor.translate(actor.data.direction)
    if (game.data.level.isBlocked(...actor.coords, ...placeAhead.coords)) {
        return new MovementAction("TURN", RelativeDirection.RIGHT)
    } else {
        return new MovementByAction(.2,RelativeDirection.FORWARD)
    }
}
function moveAntiClockwise(actor: Figure, game: Game, behaviour: Behaviour): Action {
    const placeAhead = actor.translate(actor.data.direction)
    if (game.data.level.isBlocked(...actor.coords, ...placeAhead.coords)) {
        return new MovementAction("TURN", RelativeDirection.LEFT)
    } else {
        return new MovementByAction(.2,RelativeDirection.FORWARD)
    }
}
function shiftAround(actor: Figure, game: Game, behaviour: Behaviour): Action | null {
    if (game.tickCount % 3 !== 0) { return null }
    return new ShiftAction({ x: Math.random(), y: Math.random() })
}

function wanderForward(actor: Figure, game: Game, behaviour: Behaviour): Action | null {
    if (game.tickCount % 2 !== 0) { return null }
    return new MovementByAction(.2,RelativeDirection.FORWARD)
}

const decisionFunctions = {
    moveClockwise, moveAntiClockwise, shiftAround, wanderForward
}

class Behaviour {
    decisionFunction: DecisionFunction

    constructor(decisionFunction: DecisionFunction) {
        this.decisionFunction = decisionFunction
    }

    decideAction(actor: Figure, game: Game): Action | null {
        return this.decisionFunction(actor, game, this);
    }

}

export { Behaviour, decisionFunctions }
