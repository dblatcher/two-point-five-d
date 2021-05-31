import { Sprite, SpriteSheet } from "@/canvas/Sprite"


const spriteSheets: SpriteSheet[] = []
//https://opengameart.org/content/cute-duck-animated-set
const duck_front = new SpriteSheet("duck-front", require("../assets/sprites/duck-front.png"), spriteSheets)
const duck_side = new SpriteSheet("duck-side", require("../assets/sprites/duck-side.png"), spriteSheets)
const duck_back = new SpriteSheet("duck-back", require("../assets/sprites/duck-back.png"), spriteSheets)

//https://opengameart.org/content/dinosaur-0
const dinosaur = new SpriteSheet("dinosaur", require("../assets/sprites/dinosaur.png"), spriteSheets, { pattern: "GRID", cols: 3, rows: 4 })

//https://opengameart.org/content/old-school-dungeon-crawler-pack
const bricks = new SpriteSheet("bricks", require("../assets/sprites/brick.png"), spriteSheets)


const duckSprite = new Sprite("DUCK", [
    { key: "BACK", sheet: duck_front },
    { key: "LEFT", sheet: duck_side },
    { key: "RIGHT", sheet: duck_side, transforms: ["FLIP_H"] },
    { key: "FORWARD", sheet: duck_back },
],{
    shadow: { x: 1 / 3, y: 1 / 12 },
})

const brickWall =new Sprite("BRICK_WALL", [
    { key: "FORWARD", sheet: bricks },
    { key: "BACK", sheet: bricks },
    { key: "LEFT", sheet: bricks, transforms: ["SKEW_LEFT"] },
    { key: "RIGHT", sheet: bricks, transforms: ["SKEW_RIGHT"] },
])

const dinoSprite = new Sprite("DINOSAUR", [
    { key: "BACK", sheet: dinosaur, col: 0, row: 0 },
    { key: "LEFT", sheet: dinosaur, col: 1, row: 0, transforms: ["FLIP_H"] },
    { key: "RIGHT", sheet: dinosaur, col: 1, row: 0 },
    { key: "FORWARD", sheet: dinosaur, col: 2, row: 0 },
], {
    baseline: .05,
    shadow: { x: 1 / 3, y: 1 / 12 }
})

export { duckSprite, dinoSprite, spriteSheets, brickWall }