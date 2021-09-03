import { Intersitial } from "@/game-classes/Intersitial"
import { ItemType } from "@/game-classes/ItemType"
import { NonPlayerCharacter } from "./NonPlayerCharacter"

interface QuestData {
    state: "NOT_TAKEN" | "TAKEN" | "SUCCESS" | "FAIL"
    title: string
    description: string
    id: string
    acceptMessage?: string
    refuseMessage?: string
    itemsGivenOnAccept?: ItemType[]
}

class Quest {
    data: QuestData

    constructor(data: QuestData) {
        this.data = data
    }

    createOfferDialogue(npc: NonPlayerCharacter): Intersitial {

        return new Intersitial({
            role: "MESSAGE",
            content: `${npc.data.name}: ${this.data.description}`,
            options: [
                {
                    buttonText: 'Accept Quest', response: (game) => {
                        this.data.state = "TAKEN"
                        if (this.data.acceptMessage) {
                            npc.say(this.data.acceptMessage, game)
                        }
                        npc.doAnimation("WALK", 8);

                        const { itemsGivenOnAccept = [] } = this.data
                        itemsGivenOnAccept.forEach((itemType,index) => { 
                            const distanceRightOfCenter = (index / itemsGivenOnAccept.length) -.5
                            game.createItemInfrontOfPlayer(itemType, distanceRightOfCenter,.3) 
                        })
                        Intersitial.clearIntersitial(game)
                    }
                },
                {
                    buttonText: 'Refuse Quest', response: (game) => {
                        if (this.data.refuseMessage) {
                            npc.say(this.data.refuseMessage, game)
                        }
                        npc.doAnimation("WALK", 8);
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
    action: "GIVE" | "COMPLETE"
}

class QuestHook {
    data: QuestHookData

    constructor(data: QuestHookData) {
        this.data = data
    }
}


export { Quest, QuestData, QuestHook, QuestHookData }