import { Game } from './Game';
import { Figure } from './Figure';


class Action {
    action: "TURN" | "MOVE"
    direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK"

    constructor(action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK") {
        this.action = action;
        this.direction = direction;
    }
}

interface DecisionFunction {
    (actor: Figure, game: Game, behaviour: Behaviour): Action
}

function moveClockwise(actor: Figure, game: Game, behaviour: Behaviour): Action {
    const placeAhead = actor.translate(actor.data.direction)
    if (game.data.level.isBlocked(...actor.coords, ...placeAhead.coords)) {
        return new Action("TURN", "RIGHT")
    } else {
        return new Action("MOVE", "FORWARD")
    }
}
function moveAntiClockwise(actor: Figure, game: Game, behaviour: Behaviour): Action {
    const placeAhead = actor.translate(actor.data.direction)
    if (game.data.level.isBlocked(...actor.coords, ...placeAhead.coords)) {
        return new Action("TURN", "LEFT")
    } else {
        return new Action("MOVE", "FORWARD")
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

export { Behaviour, Action, decisionFunctions }
