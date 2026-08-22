import { Color } from "@/canvas/Color"
import { Character } from "../rpg-classes/Character"

interface NarrativeMessageData {
    content: string
    color: Color
    character?: Character
}


class NarrativeMessage {
    data: NarrativeMessageData
    ticksLeft:number

    constructor(config: NarrativeMessageData) {
        this.data = config
        this.ticksLeft = 10
    }
}

export {NarrativeMessage, NarrativeMessageData}