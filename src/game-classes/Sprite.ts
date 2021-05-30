
interface SpriteSheetConfig {
    pattern: "SINGLE" | "GRID"
    rows?: number
    cols?: number
}



class SpriteSheet {
    id: string
    // eslint-disable-next-line
    src: any
    config: SpriteSheetConfig
    // eslint-disable-next-line 
    constructor(id: string, src: any, collection?: SpriteSheet[], config?: SpriteSheetConfig) {
        this.id = id
        this.src = src
        this.config = config || { pattern: "SINGLE" }
        if (collection) { collection.push(this) }
    }
}

interface Frame {
    key: string
    sheet: SpriteSheet
    row?: number
    col?: number
    transforms?: Array<"FLIP_H">
}

class Sprite {
    name: string
    frames: Frame[]

    constructor(name: string, frames: Frame[]) {
        this.name = name
        this.frames = frames
    }

    getFrame(key: string): Frame | undefined {
        return this.frames.find(frame => frame.key == key)
    }

    getFrameSelector(key: string): string | undefined {
        const frame = this.getFrame(key)
        if (!frame) {return undefined}
        return `img[sheet-id=${frame.sheet.id}]`
    }
}

export {
    SpriteSheet, Sprite,
}