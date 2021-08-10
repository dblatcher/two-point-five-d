import { Color } from "@/canvas/Color"
import { Sprite } from "@/canvas/Sprite"

interface NarrativeMessageData {
    content: string
    color: Color
    sprite?: Sprite
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