import { Game } from './Game';
import { Action, MovementAction, MovementByAction, ShiftAction } from './Action';
import { RelativeDirection } from './RelativeDirection';
import { NonPlayerCharacter } from '@/game-classes/NonPlayerCharacter';



interface DecisionFunction {
    (actor: NonPlayerCharacter, game: Game, behaviour: Behaviour): Action | null
}

function moveClockwise(actor: NonPlayerCharacter, game: Game, behaviour: Behaviour): Action|null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const distance = .1
    const placeAhead = vantage.translate({
        x: vantage.data.direction.x * distance,
        y: vantage.data.direction.y * distance,
    })

    if (game.data.level.isBlocked(...vantage.coords, ...placeAhead.coords)) {
        return new MovementAction("TURN", RelativeDirection.RIGHT)
    } else {
        return new MovementByAction(distance, RelativeDirection.FORWARD)
    }
}

function moveAntiClockwise(actor: NonPlayerCharacter, game: Game, behaviour: Behaviour): Action|null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const distanceToMove = .05
    const howCloseToGet = .5
    const whereToLookForBlockage = vantage.translate({
        x: vantage.data.direction.x * howCloseToGet,
        y: vantage.data.direction.y * howCloseToGet,
    })

    if (game.data.level.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords)) {
        return new MovementAction("TURN", RelativeDirection.LEFT)
    } else {
        return new MovementByAction(distanceToMove, RelativeDirection.FORWARD)
    }
}

function moveBackAndForward(actor: NonPlayerCharacter, game: Game, behaviour: Behaviour): Action|null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const distanceToMove = .05
    const howCloseToGet = .5
    const whereToLookForBlockage = vantage.translate({
        x: vantage.data.direction.x * howCloseToGet,
        y: vantage.data.direction.y * howCloseToGet,
    })

    if (game.data.level.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords)) {
        return new MovementAction("TURN", RelativeDirection.BACK)
    } else {
        return new MovementByAction(distanceToMove, RelativeDirection.FORWARD)
    }
}

function shiftAround(actor: NonPlayerCharacter, game: Game, behaviour: Behaviour): Action | null {
    if (game.tickCount % 3 !== 0) { return null }
    return new ShiftAction({ x: Math.random(), y: Math.random() })
}

function wanderForward(actor: NonPlayerCharacter, game: Game, behaviour: Behaviour): Action | null {
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

    decideAction(actor: NonPlayerCharacter, game: Game): Action | null {
        return this.decisionFunction(actor, game, this);
    }

}

export { Behaviour, decisionFunctions, DecisionFunction }
