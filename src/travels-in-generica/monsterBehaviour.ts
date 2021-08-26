import { Action, DoAction, ShiftAction } from "@/game-classes/Action"
import { Actor } from "@/game-classes/Actor"
import { Behaviour, decisionFunctions } from "@/game-classes/Behaviour"
import { Game } from "@/game-classes/Game"
import { Monster } from "@/rpg-classes/Monster"



function beMonster(actor: Actor, game: Game, behaviour: Behaviour): Action | null {

    const monster = actor as Monster;


    if (monster.hasPlayerInFront(game)) {

        if (monster.currentAction?.action === "DO" || monster.actionQueue.find(action => action.action === "DO")) { 
            return null 
        }

        return new DoAction('ATTACK', 10, function (actor, game) {
            const monster = actor as Monster;
            if (monster.hasPlayerInFront(game)) {
                monster.attackPlayers(game)
            }
        })
    }

    return decisionFunctions.moveAntiClockwise(monster, game, behaviour)
}


export {
    beMonster
}