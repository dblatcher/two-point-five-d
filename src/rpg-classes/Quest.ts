import { Game } from "@/game-classes/Game"
import { Intersitial } from "@/game-classes/Intersitial"
import { ItemType } from "@/game-classes/ItemType"
import { Level } from "@/game-classes/Level"
import { Monster } from "./Monster"
import { NonPlayerCharacter } from "./NonPlayerCharacter"


interface QuestGoalData {
    narrative: string
    haveItem?: ItemType
    allMonstersKilled?: Level
}

class QuestGoal {
    data: QuestGoalData
    constructor(data: QuestGoalData) {
        this.data = data
    }

    testComplete(game: Game): boolean {

        const { haveItem, allMonstersKilled } = this.data

        if (haveItem && game.data.itemInHand?.data.type !== haveItem) {
            return false
        }

        if (allMonstersKilled && game.data.levels.includes(allMonstersKilled)) {
            const { actors = [] } = allMonstersKilled.data
            const areLiveMonsters = actors
                .filter(actor => actor.isMonster)
                .find(monster => !(monster as Monster).data.stats.isDead)

            if (areLiveMonsters) {
                return false
            }
        }

        return true
    }
}

interface QuestData {
    state: "NOT_TAKEN" | "TAKEN" | "SUCCESS" | "FAIL"
    title: string
    description: string
    id: string

    itemsGivenOnAccept?: ItemType[]
    itemsGivenOnComplete?: ItemType[]
    goals: QuestGoal[]
}

class Quest {
    data: QuestData

    constructor(data: QuestData) {
        this.data = data
    }

    checkIfFinished(game: Game): boolean {
        return !this.data.goals.find(goal => !goal.testComplete(game))
    }

    markComplete(): Quest {
        this.data.state = "SUCCESS"
        return this
    }

    createCompleteDialogue(npc: NonPlayerCharacter, questHook: QuestHook): Intersitial {
        const { message } = questHook.data
        return new Intersitial({
            role: "MESSAGE",
            heading: npc.data.name,
            content: message,
            options: [{
                buttonText: "ok",
                response: game => {

                    const { itemsGivenOnComplete = [] } = this.data
                    itemsGivenOnComplete.forEach((itemType, index) => {
                        const distanceRightOfCenter = (index / itemsGivenOnComplete.length) - .5
                        game.createItemInfrontOfPlayer(itemType, distanceRightOfCenter, .3)
                    })

                    Intersitial.clearIntersitial(game)
                }
            }],
            pausesTime: true
        })
    }

    createOfferDialogue(npc: NonPlayerCharacter, questHook: QuestHook): Intersitial {
        const { message, acceptMessage, refuseMessage } = questHook.data
        return new Intersitial({
            role: "MESSAGE",
            heading: npc.data.name,
            content: message,
            options: [
                {
                    buttonText: 'Accept Quest', response: (game) => {
                        this.data.state = "TAKEN"
                        if (acceptMessage) {
                            npc.say(acceptMessage, game)
                        }
                        npc.doAnimation("TALK", 16);

                        const { itemsGivenOnAccept = [] } = this.data
                        itemsGivenOnAccept.forEach((itemType, index) => {
                            const distanceRightOfCenter = (index / itemsGivenOnAccept.length) - .5
                            game.createItemInfrontOfPlayer(itemType, distanceRightOfCenter, .3)
                        })
                        Intersitial.clearIntersitial(game)
                    }
                },
                {
                    buttonText: 'Refuse Quest', response: (game) => {
                        if (refuseMessage) {
                            npc.say(refuseMessage, game)
                        }
                        npc.doAnimation("TALK", 16);
                        Intersitial.clearIntersitial(game)
                    }
                }
            ],
            pausesTime: true
        })
    }
}

interface QuestHookData {
    questId: string
    action: "GIVE" | "REWARD" | "REMIND"
    message: string
    acceptMessage?: string
    refuseMessage?: string
}

class QuestHook {
    data: QuestHookData

    constructor(data: QuestHookData) {
        this.data = data
    }
}


export { Quest, QuestData, QuestHook, QuestHookData, QuestGoalData, QuestGoal }