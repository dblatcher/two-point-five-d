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
const window = new SpriteSheet("window", require("../assets/sprites/open-window.png"), spriteSheets)

const testCard = new SpriteSheet("testCard", require("../assets/sprites/test-card.png"), spriteSheets)
const painting = new SpriteSheet("painting", require("../assets/sprites/ceiling-small.jpg"), spriteSheets)

const duckSprite = new Sprite("DUCK", [
    { key: "BACK", sheet: duck_front },
    { key: "LEFT", sheet: duck_side },
    { key: "RIGHT", sheet: duck_side, transforms: ["FLIP_H"] },
    { key: "FORWARD", sheet: duck_back },
], {
    shadow: { x: 1 / 3, y: 1 / 12 },
})



const dinoSprite = new Sprite("DINOSAUR", [
    { key: "BACK", sheet: dinosaur, col: 0, row: 0 },
    { key: "LEFT", sheet: dinosaur, col: 1, row: 0, transforms: ["FLIP_H"] },
    { key: "RIGHT", sheet: dinosaur, col: 1, row: 0 },
    { key: "FORWARD", sheet: dinosaur, col: 2, row: 0 },
], {
    baseline: 0.05,
    shadow: { x: 1 / 3, y: 1 / 12 }
})

const testSprite = new Sprite("TEST_CARD", [
    { key: "BACK", sheet: testCard },
    { key: "LEFT", sheet: testCard },
    { key: "RIGHT", sheet: testCard },
    { key: "FORWARD", sheet: testCard },
], {
    baseline: 0,
    shadow: { x: 1 / 3, y: 1 / 12 }
})

const brickPattern = Sprite.patternSprite("BRICK_WALL", bricks);
const windowPattern = Sprite.patternSprite("WINDOW", window);
const paintingWall = Sprite.patternSprite("painting", painting, { size: { x: .5, y: .5 }, offset: { x: .25, y: .25 } });


export { duckSprite, dinoSprite, testSprite, spriteSheets, brickPattern as brickWall, windowPattern as windowWall, paintingWall }