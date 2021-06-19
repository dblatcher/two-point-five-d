import { Game } from './Game';
import { Figure } from './Figure';
import { Action, MovementAction } from './Action';



interface DecisionFunction {
    (actor: Figure, game: Game, behaviour: Behaviour): Action
}

function moveClockwise(actor: Figure, game: Game, behaviour: Behaviour): MovementAction {
    const placeAhead = actor.translate(actor.data.direction)
    if (game.data.level.isBlocked(...actor.coords, ...placeAhead.coords)) {
        return new MovementAction("TURN", "RIGHT")
    } else {
        return new MovementAction("MOVE", "FORWARD")
    }
}
function moveAntiClockwise(actor: Figure, game: Game, behaviour: Behaviour): MovementAction {
    const placeAhead = actor.translate(actor.data.direction)
    if (game.data.level.isBlocked(...actor.coords, ...placeAhead.coords)) {
        return new MovementAction("TURN", "LEFT")
    } else {
        return new MovementAction("MOVE", "FORWARD")
    }
}

const decisionFunctions = {
    moveClockwise,moveAntiClockwise
}

class Behaviour {
    decisionFunction: DecisionFunction

    constructor(decisionFunction: DecisionFunction) {
        this.decisionFunction = decisionFunction
    }

    decideAction(actor: Figure, game: Game): Action {
        return this.decisionFunction(actor, game, this);
    }

}

export { Behaviour, decisionFunctions }
