import { Actor } from '@/game-classes/Actor';
import { Action } from './Action';
import { Game } from './Game';

interface DecisionFunction {
    (actor: Actor, game: Game, behaviour: Behaviour): Action | null
}

class Behaviour {
    decisionFunction: DecisionFunction
    history: Action[]
    static historyLength = 5

    constructor(decisionFunction: DecisionFunction) {
        this.decisionFunction = decisionFunction
        this.history = []
    }

    decideAction(actor: Actor, game: Game): Action | null {
        const decision = this.decisionFunction(actor, game, this)

        if (decision) {
            this.history.unshift(decision)
        }

        if (this.history.length > Behaviour.historyLength) {
            this.history.splice(Behaviour.historyLength, this.history.length - Behaviour.historyLength)
        }

        return decision;
    }

}

export { Behaviour, DecisionFunction };

