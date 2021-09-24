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
    bitmap?: ImageBitmap
    constructor(id: string, src: any, collection?: SpriteSheet[], config?: SpriteSheetConfig) {
        this.id = id
        this.src = src
        this.config = config || { pattern: "SINGLE" }
        if (collection) { collection.push(this) }
    }

    async load(): Promise<boolean> {
        // console.log(`SpriteSheet${this.id} loading ${this.src}`)

        try {
            const response = await fetch(this.src)
            const blob = await response.blob()
            const bitmap = await createImageBitmap(blob)
            this.bitmap = bitmap;
            return true
        } catch (error) {
            console.warn(error)
            return false
        }

    }

    static async loadAll(spriteSheets: SpriteSheet[]): Promise<number> {
        console.log(`Loading ${spriteSheets.length} sheets!`);
        const results = await Promise.all(spriteSheets.map(spriteSheet => spriteSheet.load()))

        if (results.every(result => result == true)) {
            console.log(`All ${spriteSheets.length} loaded!`);
        } else {
            console.log(`${results.filter(result => !result).length} of ${spriteSheets.length} failed!`);
        }
        return results.filter(result => result).length
    }
}

export { SpriteSheet, SpriteSheetConfig }