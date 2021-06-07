import { Frame, Sprite, SpriteSheet } from "@/canvas/Sprite"


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

const duckSprite = new Sprite("DUCK", {
    shadow: { x: 1 / 3, y: 1 / 12 },
    animations: new Map()
        .set("STAND_FORWARD", [
            { key: "STAND_FORWARD_0", sheet: duck_back },
        ])
        .set("STAND_BACK", [
            { key: "STAND_BACK_0", sheet: duck_front },
        ])
        .set("STAND_LEFT", [
            { key: "STAND_LEFT_0", sheet: duck_side },
        ])
        .set("STAND_RIGHT", [
            { key: "STAND_RIGHT_0", sheet: duck_side, transforms: ["FLIP_H"] },
        ]),
})


const dinoSprite = new Sprite("DINOSAUR", {
    baseline: 0.05,
    shadow: { x: 1 / 3, y: 1 / 12 },
    animations: new Map()
        .set("STAND_FORWARD", [
            { key: "STAND_FORWARD_0", sheet: dinosaur, col: 2, row: 0 },
        ])
        .set("STAND_BACK", [
            { key: "STAND_BACK_0", sheet: dinosaur, col: 0, row: 0 },
        ])
        .set("STAND_LEFT", [
            { key: "STAND_LEFT_0", sheet: dinosaur, col: 1, row: 0, transforms: ["FLIP_H"] },
        ])
        .set("STAND_RIGHT", [
            { key: "STAND_RIGHT_0", sheet: dinosaur, col: 1, row: 0 },
        ])
        .set("WALK_FORWARD", [
            { key: "WALK_FORWARD_0", sheet: dinosaur, col: 2, row: 0 },
            { key: "WALK_FORWARD_1", sheet: dinosaur, col: 2, row: 1 },
            { key: "WALK_FORWARD_2", sheet: dinosaur, col: 2, row: 2 },
            { key: "WALK_FORWARD_3", sheet: dinosaur, col: 2, row: 3 },
        ])
        .set("WALK_BACK", [
            { key: "WALK_BACK_0", sheet: dinosaur, col: 0, row: 0 },
            { key: "WALK_BACK_1", sheet: dinosaur, col: 0, row: 1 },
            { key: "WALK_BACK_2", sheet: dinosaur, col: 0, row: 2 },
            { key: "WALK_BACK_3", sheet: dinosaur, col: 0, row: 3 },
        ])
        .set("WALK_LEFT", [
            { key: "WALK_LEFT_0", sheet: dinosaur, col: 1, row: 0, transforms: ["FLIP_H"] },
            { key: "WALK_LEFT_1", sheet: dinosaur, col: 1, row: 1, transforms: ["FLIP_H"] },
            { key: "WALK_LEFT_2", sheet: dinosaur, col: 1, row: 2, transforms: ["FLIP_H"] },
            { key: "WALK_LEFT_3", sheet: dinosaur, col: 1, row: 3, transforms: ["FLIP_H"] },
        ])
        .set("WALK_RIGHT", [
            { key: "WALK_RIGHT_0", sheet: dinosaur, col: 1, row: 0 },
            { key: "WALK_RIGHT_1", sheet: dinosaur, col: 1, row: 1 },
            { key: "WALK_RIGHT_2", sheet: dinosaur, col: 1, row: 2 },
            { key: "WALK_RIGHT_3", sheet: dinosaur, col: 1, row: 3 },
        ])
})

const testSprite = new Sprite("TEST_CARD", {
    baseline: 0,
    shadow: { x: 1 / 3, y: 1 / 12 },
    animations: new Map()
    .set("STAND_FORWARD", [
        { key: "STAND_FORWARD_0", sheet: testCard },
    ])
    .set("STAND_BACK", [
        { key: "STAND_BACK_0", sheet: testCard },
    ])
    .set("STAND_LEFT", [
        { key: "STAND_LEFT_0", sheet: testCard },
    ])
    .set("STAND_RIGHT", [
        { key: "STAND_RIGHT_0", sheet: testCard},
    ]),
})

const brickPattern = Sprite.patternSprite("BRICK_WALL", bricks);
const windowPattern = Sprite.patternSprite("WINDOW", window);
const paintingWall = Sprite.patternSprite("painting", painting, { size: { x: .5, y: .5 }, offset: { x: .25, y: .25 } });


export { duckSprite, dinoSprite, testSprite, spriteSheets, brickPattern as brickWall, windowPattern as windowWall, paintingWall }