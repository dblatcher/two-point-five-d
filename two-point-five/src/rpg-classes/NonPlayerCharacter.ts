import { Color } from "@/canvas/Color"
import { Actor, ActorData, ActorInput } from "@/game-classes/Actor"
import { Game } from "@/game-classes/Game"
import { Vantage } from "@/game-classes/Vantage"
import { Quest, QuestHook, QuestHookData } from "./Quest"
import { Sprite } from "@/canvas/Sprite"
import { Behaviour } from "@/game-classes/Behaviour"


export type NonPlayerCharacterData = ActorData & {
    actorType: 'NonPlayerCharacter',
    talkMessage?: string
    name?: string
    questHooks?: QuestHook[]
}

export type NonPlayerCharacterInput = ActorInput & {
    actorType: 'NonPlayerCharacter',
    talkMessage?: string
    name?: string
    questHooks?: QuestHookData[]
}

export class NonPlayerCharacter extends Actor {
    data: NonPlayerCharacterData

    constructor(input: NonPlayerCharacterInput, sprite: Sprite, behaviour: Behaviour | undefined) {
        super(input, sprite, behaviour)
        this.data = {
            ...input,
            vantage: input.vantage && new Vantage(input.vantage),
            sprite,
            behaviour,
            questHooks: input.questHooks?.map(input => new QuestHook(input)),
        }
        this.data.blocksSquare = true
        this.data.canInteractWith = typeof input.canInteractWith == 'undefined' ? true : input.canInteractWith
    }

    serialise(): NonPlayerCharacterInput {
        const { data } = this
        return {
            ...data,
            sprite: data.sprite.id,
            vantage: data.vantage?.data,
            behaviour: data.behaviour?.functionName,
            talkMessage: data.talkMessage,
            name: data.name,
            questHooks: data.questHooks?.map(hook => hook.data),
        }
    }

    say(content: string, game: Game): void {
        game.addMessage({
            content: `${this.data.name || "NAMELESS_CHARACTER"}: "${content}"`,
            color: Color.GRAY
        });
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

    getQuestsAndHooksWhichICan(hookAction: string, questState: string, game: Game): { quest: Quest, questHook: QuestHook }[] {
        const { questHooks = [] } = this.data
        const { quests = [] } = game.data;
        const questsAndHooks: { quest: Quest, questHook: QuestHook }[] = [];

        questHooks.filter(questHook => questHook.data.action == hookAction).forEach(questHook => {
            const matchingQuest = quests.find(quest => quest.data.id === questHook.data.questId)
            if (matchingQuest) {
                questsAndHooks.push({ quest: matchingQuest, questHook })
            }
        })

        return questsAndHooks.filter(questAndHook => questAndHook.quest.data.state === questState)
    }

    handleInteraction(_actor: Vantage | Actor, game: Game): void {

        const questsAvailableAndHook = this.getQuestsAndHooksWhichICan("GIVE", "NOT_TAKEN", game)

        const questCompletedAndHook = this.getQuestsAndHooksWhichICan("REWARD", "TAKEN", game)
            .find(questAndHook => questAndHook.quest.checkIfFinished(game));

        const questsToRemindOnAndHooks = this.getQuestsAndHooksWhichICan("REMIND", "TAKEN", game)

        // to do - handle multiple quests
        if (questCompletedAndHook) {
            game.data.intersitial = questCompletedAndHook.quest.markComplete().createCompleteDialogue(this, questCompletedAndHook.questHook);
        } else if (questsAvailableAndHook.length > 0) {
            const questOnOfferAndHook = questsAvailableAndHook[0]
            game.data.intersitial = questOnOfferAndHook.quest.createOfferDialogue(this, questOnOfferAndHook.questHook);
        } else if (questsToRemindOnAndHooks.length > 0) {
            this.doAnimation("TALK", 16);
            this.say(questsToRemindOnAndHooks[0].questHook.data.message, game)
        } else if (this.data.talkMessage) {
            this.doAnimation("TALK", 16);
            this.say(this.data.talkMessage, game)
        }

    }

}


