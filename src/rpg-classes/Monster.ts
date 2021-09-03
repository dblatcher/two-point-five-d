import { Color } from "@/canvas/Color"
import { Sprite } from "@/canvas/Sprite"
import { DoAction } from "@/game-classes/Action"
import { Actor } from "@/game-classes/Actor"
import { Behaviour } from "@/game-classes/Behaviour"
import { Game } from "@/game-classes/Game"
import { NarrativeMessage } from "@/game-classes/NarrativeMessage"
import { Vantage } from "@/game-classes/Vantage"
import { CharacterStats } from "./CharacterStats"


interface MonsterData {
    vantage?: Vantage
    sprite: Sprite
    behaviour?: Behaviour
    height?: number
    width?: number
    blocksSquare?: boolean
    stats: CharacterStats
    defaultAttackAnimation?: string
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

    takeDamage(amount: number, game: Game): number {
        this.actionQueue.push(new DoAction('hurt', 8))
        const health = this.data.stats.health.down(amount);
        // game.narrativeMessages.push(new NarrativeMessage({ content: `It has ${health} health left.`, color: Color.TRANSPARENT }))
        return health;
    }

    attackPlayers(game: Game):void {
        const hit = Math.random() > .5;
        const attackedCharacter = game.getRandomLivingCharacter();

        if (!attackedCharacter) { return }

        if (!hit) {
            game.narrativeMessages.push(new NarrativeMessage({ 
                content: `The ${this.data.sprite.name} missed ${attackedCharacter.data.name}`, 
                color: Color.TRANSPARENT
             }))
            return
        }

        attackedCharacter.say("ouch!",game)
        attackedCharacter.takeDamage(1)
    }

    hasPlayerInFront(game: Game): boolean {
        const { vantage } = this.data
        if (!vantage) { return false }
        const { playerVantage, level } = game.data
        const squareAheadIsBlocked = level.hasSquareAheadBlocked(vantage)
        const squareAhead = vantage.translate(vantage.data.direction)

        return !squareAheadIsBlocked && squareAhead.isInSameSquareAs(playerVantage)
    }

    tick(game: Game): void {
        Actor.prototype.tick.apply(this, [game])

        if (!this.isDying && this.data.stats.isDead) {
            // game.narrativeMessages.push(new NarrativeMessage({ content: `It has died!`, color: Color.TRANSPARENT }))

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