import { Color } from "@/canvas/Color"
import { Sprite } from "@/canvas/Sprite"
import { DoAction } from "@/game-classes/Action"
import { Actor } from "@/game-classes/Actor"
import { Behaviour } from "@/game-classes/Behaviour"
import { Game } from "@/game-classes/Game"
import { Intersitial } from "@/game-classes/Intersitial"
import { NarrativeMessage } from "@/game-classes/NarrativeMessage"
import { Vantage } from "@/game-classes/Vantage"
import { CharacterStats } from "./CharacterStats"


interface MonsterData {
    vantage?: Vantage
    sprite: Sprite
    behaviour?: Behaviour
    height?: number
    width?: number
    blocksSquare?:boolean
    stats: CharacterStats
}

class Monster extends Actor {
    data: MonsterData
    isDying: boolean

    constructor(data: MonsterData) {
        super(data)
        this.data = data
        this.data.blocksSquare = true
        this.isDying = false
    }

    handleInteraction(actor: Vantage | Actor, game: Game): void {
        console.log('handleInteraction', game.tickCount)
    }

    damage(amount:number, game:Game):number {
        this.actionQueue.push( new DoAction('hurt',8))
        const health = this.data.stats.health.down(amount);
        game.narrativeMessages.push(new NarrativeMessage({ content: `It has ${health} health left.`, color: Color.TRANSPARENT }))
        return health;
    }

    tick(game: Game): void {
        Actor.prototype.tick.apply(this, [game])

        if (!this.isDying && this.data.stats.isDead) {
            game.narrativeMessages.push(new NarrativeMessage({ content: `It has died!`, color: Color.TRANSPARENT }))

            this.isDying = true

            this.actionQueue = []
            this.currentAction = new DoAction("DIE", 15, function (actor, game) {
                (actor as Actor).data.vantage = undefined
            })

        }
    }
}

export {
    Monster
}