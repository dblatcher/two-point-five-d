import { Color } from "@/canvas/Color"
import { DoAction } from "@/game-classes/Action"
import { Actor, ActorData } from "@/game-classes/Actor"
import { Game } from "@/game-classes/Game"
import { Vantage } from "@/game-classes/Vantage"
import { CharacterStats } from "./CharacterStats"


export type MonsterData = ActorData & {
    actorType: 'Monster'
    stats: CharacterStats
    defaultAttackAnimation?: string
}

export class Monster extends Actor {
    data: MonsterData
    isDying: boolean

    constructor(data: MonsterData) {
        super(data)
        this.data = data
        this.data.blocksSquare = true
        this.isDying = false
    }

    handleInteraction(_actor: Vantage | Actor, game: Game): void {
        console.log('handleInteraction', game.tickCount)
    }

    takeDamage(amount: number, game: Game): number {
        this.actionQueue.push(new DoAction('hurt', 8))
        const health = this.data.stats.health.down(amount);
        game.addMessage({ content: `It has ${health} health left.`, color: Color.BLACK })
        return health;
    }

    attackPlayers(game: Game): void {
        const hit = Math.random() > .5;
        const attackedCharacter = game.getRandomLivingCharacter();

        if (!attackedCharacter) { return }

        if (!hit) {
            game.addMessage({
                content: `The ${this.sprite.id} missed ${attackedCharacter.data.name}`,
                color: Color.TRANSPARENT
            })
            return
        }

        attackedCharacter.say("ouch!", game)
        attackedCharacter.takeDamage(1)
    }

    hasPlayerInFront(game: Game): boolean {
        const { vantage } = this.data
        if (!vantage) { return false }
        const { playerVantage } = game.data
        const level = game.currentLevel
        const squareAheadIsBlocked = level.hasSquareAheadBlockedByWall(vantage)
        const squareAhead = vantage.translate(vantage.direction)

        return !squareAheadIsBlocked && squareAhead.isInSameSquareAs(playerVantage)
    }

    tick(game: Game): void {
        Actor.prototype.tick.apply(this, [game])

        if (!this.isDying && this.data.stats.isDead) {

            this.isDying = true

            this.actionQueue = []
            this.currentAction = new DoAction("DIE", 15, function (actor, _game) {
                (actor as Actor).data.vantage = undefined
            })

        }
    }
}



