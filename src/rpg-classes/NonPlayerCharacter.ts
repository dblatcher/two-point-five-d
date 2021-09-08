import { Color } from "@/canvas/Color"
import { Sprite } from "@/canvas/Sprite"
import { DoAction } from "@/game-classes/Action"
import { Actor } from "@/game-classes/Actor"
import { Behaviour } from "@/game-classes/Behaviour"
import { Game } from "@/game-classes/Game"
import { Intersitial } from "@/game-classes/Intersitial"
import { NarrativeMessage } from "@/game-classes/NarrativeMessage"
import { Vantage } from "@/game-classes/Vantage"
import { Quest, QuestHook } from "./Quest"


interface NonPlayerCharacterData {
    vantage?: Vantage
    sprite: Sprite
    behaviour?: Behaviour
    height?: number
    width?: number
    blocksSquare?: boolean
    talkMessage?: string
    name?: string
    canInteractWith?: boolean
    questHooks?: QuestHook[]
}

class NonPlayerCharacter extends Actor {
    data: NonPlayerCharacterData

    constructor(data: NonPlayerCharacterData) {
        super(data)
        this.data = data
        this.data.blocksSquare = true
        this.data.canInteractWith = typeof data.canInteractWith == 'undefined' ? true : data.canInteractWith
    }

    say(content: string, game: Game): void {
        game.narrativeMessages.push(new NarrativeMessage({
            content: `${this.data.name || "NAMELESS_CHARACTER"}: "${content}"`,
            color: Color.GRAY
        }))
    }

    doAnimation(animationName: string, time: number): void {
        this.actionQueue.push(new DoAction(animationName, time))
    }

    getQuestsWhichICan(hookAction: string, questState: string, game: Game): Quest[] {
        const { questHooks = [] } = this.data
        const { quests = [] } = game.data;
        const myQuests: Quest[] = [];

        questHooks.filter(hook => hook.data.action == hookAction).forEach(questHook => {
            const matchingQuest = quests.find(quest => quest.data.id === questHook.data.questId)
            if (matchingQuest) {
                myQuests.push(matchingQuest)
            }
        })

        return myQuests.filter(quest => quest.data.state === questState)
    }

    handleInteraction(actor: Vantage | Actor, game: Game): void {

        const questsAvailable = this.getQuestsWhichICan("GIVE", "NOT_TAKEN", game)
        const questsGiven = this.getQuestsWhichICan("REWARD", "TAKEN", game)
        const questCompleted = questsGiven.filter(quest => quest.checkIfFinished(game))[0];

        // to do - handle multiple quests
        if (questCompleted) {
            game.data.intersitial = questCompleted.markComplete().createCompleteDialogue(this);
        } else if (questsAvailable.length > 0) {
            const questOnOffer = questsAvailable[0]
            game.data.intersitial = questOnOffer.createOfferDialogue(this);

        } else if (this.data.talkMessage) {
            this.doAnimation("TALK", 16);
            this.say(this.data.talkMessage, game)
        }

    }

}

export {
    NonPlayerCharacter
}