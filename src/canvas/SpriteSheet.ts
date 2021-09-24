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
    bitmap?: ImageBitmap
    // eslint-disable-next-line 
    constructor(id: string, src: any, config?: SpriteSheetConfig) {
        this.id = id
        this.src = src
        this.config = config || { pattern: "SINGLE" }
    }

    async load(): Promise<boolean> {

        try {
            const response = await fetch(this.src)
            const blob = await response.blob()
            this.bitmap = await createImageBitmap(blob);
            return true
        } catch (error) {
            console.warn(error)
            return false
        }
    }

    static async loadAll(spriteSheets: SpriteSheet[]): Promise<number> {
        console.log(`Loading ${spriteSheets.length} sheets!`);
        const results = await Promise.all(spriteSheets.map(spriteSheet => spriteSheet.load()))

        if (!results.every(result => result == true)) {
            console.log(`${results.filter(result => !result).length} of ${spriteSheets.length} failed!`);
        }
        return results.filter(result => result).length
    }
}

export { SpriteSheet, SpriteSheetConfig }