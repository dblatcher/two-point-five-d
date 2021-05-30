import { Sprite, SpriteSheet } from "@/game-classes/Sprite"


const spriteSheets: SpriteSheet[] = []
//https://opengameart.org/content/cute-duck-animated-set
const duck_front = new SpriteSheet("duck-front", require("../assets/sprites/duck-front.png"), spriteSheets)
const duck_side = new SpriteSheet("duck-side", require("../assets/sprites/duck-side.png"), spriteSheets)
const duck_back = new SpriteSheet("duck-back", require("../assets/sprites/duck-back.png"), spriteSheets)

//https://opengameart.org/content/dinosaur-0
const dinosaur = new SpriteSheet("dinosaur", require("../assets/sprites/dinosaur.png"), spriteSheets, { pattern: "GRID", cols: 3, rows: 4 })

const duckSprite = new Sprite("DUCK", [
    { key: "BACK", sheet: duck_front },
    { key: "LEFT", sheet: duck_side },
    { key: "RIGHT", sheet: duck_side, transforms: ["FLIP_H"] },
    { key: "FORWARD", sheet: duck_back },
])

const dinoSprite = new Sprite("DINOSAUR", [
    { key: "BACK", sheet: dinosaur, col: 0, row: 0 },
    { key: "LEFT", sheet: dinosaur, col: 1, row: 0, transforms: ["FLIP_H"] },
    { key: "RIGHT", sheet: dinosaur, col: 1, row: 0 },
    { key: "FORWARD", sheet: dinosaur, col: 2, row: 0 },
])

export { duckSprite, dinoSprite, spriteSheets }