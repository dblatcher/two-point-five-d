import { Action, DoAction } from "@/game-classes/Action"
import { Actor } from "@/game-classes/Actor"
import { Behaviour, DecisionFunction } from "@/game-classes/Behaviour"
import { decisionFunctions } from "@/game-classes/decisionFunctions"
import { Game } from "@/game-classes/Game"
import { Monster } from "@/rpg-classes/Monster"


function makeAttack(monster: Monster): Action | null {
    if (monster.currentAction?.action === "DO" || monster.actionQueue.find(action => action.action === "DO")) {
        return null
    }

    return new DoAction(monster.data.defaultAttackAnimation || 'ATTACK', 10, function (actor, game) {
        if (!(actor instanceof Monster)) {
            return
        }
        if (monster.hasPlayerInFront(game)) {
            monster.attackPlayers(game)
        }
    })
}


function attackOrMoveAntiClockwise(actor: Actor, game: Game, behaviour: Behaviour): Action | null {
    if (!(actor instanceof Monster)) {
        return null
    }

    if (actor.hasPlayerInFront(game)) {
        return makeAttack(actor)
    }
    return decisionFunctions.moveAntiClockwise(actor, game, behaviour)
}

function attackOrMoveClockwise(actor: Actor, game: Game, behaviour: Behaviour): Action | null {
    if (!(actor instanceof Monster)) {
        return null
    }

    if (actor.hasPlayerInFront(game)) {
        return makeAttack(actor)
    }
    return decisionFunctions.moveClockwise(actor, game, behaviour)
}

function standAndFight(actor: Actor, game: Game, _behaviour: Behaviour): Action | null {
    if (!(actor instanceof Monster)) {
        return null
    }

    if (actor.hasPlayerInFront(game)) {
        return makeAttack(actor)
    }
    return null
}



export const monsterDecisionFunctions: Record<string, DecisionFunction> = {
    attackOrMoveAntiClockwise,
    standAndFight,
    attackOrMoveClockwise
}
