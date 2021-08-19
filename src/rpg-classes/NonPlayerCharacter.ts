import { Color } from "@/canvas/Color"
import { Sprite } from "@/canvas/Sprite"
import { DoAction } from "@/game-classes/Action"
import { Actor } from "@/game-classes/Actor"
import { Behaviour } from "@/game-classes/Behaviour"
import { Game } from "@/game-classes/Game"
import { Intersitial } from "@/game-classes/Intersitial"
import { NarrativeMessage } from "@/game-classes/NarrativeMessage"
import { Vantage } from "@/game-classes/Vantage"


interface NonPlayerCharacterData {
    vantage?: Vantage
    sprite: Sprite
    behaviour?: Behaviour
    height?: number
    width?: number

    talkMessage?: string
    name?:string
}

class NonPlayerCharacter extends Actor {
    data: NonPlayerCharacterData

    constructor(data: NonPlayerCharacterData) {
        super(data)
        this.data = data
    }

    handleInteraction(actor: Vantage | Actor, game: Game): void {
        console.log('handleInteraction', game.tickCount)
        this.actionQueue.push(new DoAction("WALK", 8))

        game.narrativeMessages.push(new NarrativeMessage({
            content: `${this.data.name || "NAMELESS_CHARACTER"}: "${this.data.talkMessage}"`,
            color: Color.GRAY
        }))

        game.data.intersitial = new Intersitial({
            role: "MESSAGE",
            content: (this.data.talkMessage || 'I say nothing.'),
            options: [
                { buttonText: 'done', response: Intersitial.clearIntersitial }
            ],
            pausesTime: true
        })
    }

}

export {
    NonPlayerCharacter
}