import { Game } from "@/game-classes/Game"
import { Intersitial } from "@/game-classes/Intersitial"
import { Monster } from "./Monster"
import { NonPlayerCharacter } from "./NonPlayerCharacter"


interface QuestData {
    state: "NOT_TAKEN" | "TAKEN" | "SUCCESS" | "FAIL"
    title: string
    description: string
    id: string

    itemsGivenOnAccept?: string[]
    itemsGivenOnComplete?: string[]
    goals: QuestGoal[]
}


interface QuestGoal {
    narrative: string
    haveItem?: string
    allMonstersKilled?: string
}


class Quest {
    data: QuestData

    constructor(data: QuestData) {
        this.data = data
    }

    serialise() {
        return this.data
    }

    checkIfFinished(game: Game): boolean {
        return this.data.goals.every(goal => Quest.testGoalComplete(goal, game))
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

    static testGoalComplete(goal: QuestGoal, game: Game) {
        const { haveItem, allMonstersKilled } = goal
        if (haveItem && game.data.itemInHand?.itemType.id !== haveItem) {
            return false
        }
        if (allMonstersKilled) {
            const level = game.data.levels.find(level => level.id === allMonstersKilled)
            if (!level) {
                console.error('no such level', allMonstersKilled, game.data.levels.map(l => l.id))
            } else {
                const { actors = [] } = level.data
                const areLiveMonsters = actors
                    .filter(actor => actor instanceof Monster)
                    .find(monster => !monster.data.stats.isDead)

                if (areLiveMonsters) {
                    return false
                }
            }
        }
        return true
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


export { Quest, QuestData, QuestHook, QuestHookData }

