import { Game } from './Game';
import { Action, MovementAction, WalkForward, ShiftAction } from './Action';
import { RelativeDirection } from './RelativeDirection';
import { Actor } from '@/game-classes/Actor';



interface DecisionFunction {
    (actor: Actor, game: Game, behaviour: Behaviour): Action | null
}

function moveClockwise(actor: Actor, game: Game, behaviour: Behaviour): Action | null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const whereToLookForBlockage = vantage.translate({
        ...vantage.data.direction
    })

    if (actor.currentAction) { return null }
    else if (game.data.level.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor, game)) {
        return new MovementAction("TURN", RelativeDirection.RIGHT)
    } else {
        return new WalkForward();
    }
}

function moveAntiClockwise(actor: Actor, game: Game, behaviour: Behaviour): Action | null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const whereToLookForBlockage = vantage.translate({
        ...vantage.data.direction
    })

    if (actor.currentAction) { return null }
    else if (game.data.level.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor, game)) {
        return new MovementAction("TURN", RelativeDirection.LEFT)
    } else {
        return new WalkForward();
    }
}

function moveBackAndForward(actor: Actor, game: Game, behaviour: Behaviour): Action | null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const whereToLookForBlockage = vantage.translate({
        ...vantage.data.direction
    })

    if (actor.currentAction) { return null }
    else if (game.data.level.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor, game)) {
        return new MovementAction("TURN", RelativeDirection.BACK)
    } else {
        return new WalkForward();
    }
}

function shiftAround(actor: Actor, game: Game, behaviour: Behaviour): Action | null {
    if (game.tickCount % 3 !== 0) { return null }
    return new ShiftAction({ x: Math.random(), y: Math.random() })
}

function wanderForward(actor: Actor, game: Game, behaviour: Behaviour): Action | null {
    if (actor.currentAction) { return null }
    if (game.tickCount % 10 > 1 ) {return null}
    return new WalkForward();
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
