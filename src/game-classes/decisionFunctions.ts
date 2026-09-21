import { Game } from './Game';
import { Action, MovementAction, WalkForward, ShiftAction, DoAction } from './Action';
import { RelativeDirection } from './RelativeDirection';
import { Actor } from '@/game-classes/Actor';
import { Behaviour, DecisionFunction } from './Behaviour';


function moveClockwise(actor: Actor, game: Game, _behaviour: Behaviour): Action | null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const whereToLookForBlockage = vantage.translate({
        ...vantage.direction
    })

    if (actor.currentAction) { return null }
    else if (game.currentLevel.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor, game)) {
        return new MovementAction("TURN", RelativeDirection.RIGHT)
    } else {
        return new WalkForward();
    }
}

function moveAntiClockwise(actor: Actor, game: Game, _behaviour: Behaviour): Action | null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const whereToLookForBlockage = vantage.translate({
        ...vantage.direction
    })

    if (actor.currentAction) { return null }
    else if (game.currentLevel.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor, game)) {
        return new MovementAction("TURN", RelativeDirection.LEFT)
    } else {
        return new WalkForward();
    }
}

function moveBackAndForward(actor: Actor, game: Game, _behaviour: Behaviour): Action | null {

    const { vantage } = actor.data;
    if (!vantage) { return null }

    const whereToLookForBlockage = vantage.translate({
        ...vantage.direction
    })

    if (actor.currentAction) { return null }
    else if (game.currentLevel.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor, game)) {
        return new MovementAction("TURN", RelativeDirection.BACK)
    } else {
        return new WalkForward(1, .05, false);
    }
}

function shiftAround(_actor: Actor, game: Game, _behaviour: Behaviour): Action | null {
    if (game.tickCount % 3 !== 0) { return null }
    return new ShiftAction({ x: Math.random(), y: Math.random() })
}

function wanderAround(actor: Actor, _game: Game, behaviour: Behaviour): Action | null {
    if (actor.currentAction) { return null }

    const d6 = Math.ceil(Math.random() * 6);

    if (behaviour.history[0]?.action === "WALK_FORWARD") {
        return new MovementAction("TURN", d6 > 3 ? RelativeDirection.LEFT : RelativeDirection.RIGHT)
    } else if (d6 >= 5) {
        return new ShiftAction({ x: .5, y: .5 })
    }
    return new WalkForward(d6, .025, false);
}

function walkInCircle(actor: Actor, game: Game, behaviour: Behaviour): Action | null {
    if (actor.currentAction) { return null }

    const { vantage } = actor.data
    if (!vantage) { return null }

    if (behaviour.history[0]?.action === "WALK_FORWARD") {
        return new MovementAction("TURN", RelativeDirection.RIGHT)
    } else {
        if (game.currentLevel.isBlocked(...vantage.coords, ...vantage.translate(vantage.direction).coords, actor, game)) {
            return new DoAction('STAND', 8);
        } else {
            return new WalkForward(1.5, .06);
        }
    }
}

export const genericDecisionFunctions: Record<string, DecisionFunction> = {
    moveClockwise, 
    moveAntiClockwise, 
    shiftAround, 
    wanderAround, 
    moveBackAndForward, 
    walkInCircle
}