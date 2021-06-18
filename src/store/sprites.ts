import { Frame, Sprite, SpriteSheet } from "@/game-classes/Sprite"


const spriteSheets: SpriteSheet[] = []

const sheets = {
    //https://opengameart.org/content/cute-duck-animated-set
    duck_front: new SpriteSheet("duck-front", require("../assets/sprites/duck-front.png"), spriteSheets),
    duck_side: new SpriteSheet("duck-side", require("../assets/sprites/duck-side.png"), spriteSheets),
    duck_back: new SpriteSheet("duck-back", require("../assets/sprites/duck-back.png"), spriteSheets),

    //https://opengameart.org/content/dinosaur-0
    dinosaur: new SpriteSheet("dinosaur", require("../assets/sprites/dinosaur.png"), spriteSheets, { pattern: "GRID", cols: 3, rows: 4 }),

    //https://opengameart.org/content/old-school-dungeon-crawler-pack
    bricks: new SpriteSheet("bricks", require("../assets/sprites/brick.png"), spriteSheets),
    window: new SpriteSheet("window", require("../assets/sprites/open-window.png"), spriteSheets),

    testCard: new SpriteSheet("testCard", require("../assets/sprites/test-card.png"), spriteSheets),
    painting: new SpriteSheet("painting", require("../assets/sprites/ceiling-small.jpg"), spriteSheets),
    leverAndButton: new SpriteSheet("lever", require("../assets/sprites/lever-and-button.png"), spriteSheets, { pattern: "GRID", cols: 3, rows: 3 }),
}


const duckSprite = new Sprite("DUCK", {
    shadow: { x: 1 / 3, y: 1 / 8 },
    animations: new Map<string, Frame[]>()
        .set("STAND_FORWARD", [
            { sheet: sheets.duck_back },
        ])
        .set("STAND_BACK", [
            { sheet: sheets.duck_front },
        ])
        .set("STAND_LEFT", [
            { sheet: sheets.duck_side },
        ])
        .set("STAND_RIGHT", [
            { sheet: sheets.duck_side, transforms: ["FLIP_H"] },
        ]),
})


const dinoSprite = new Sprite("DINOSAUR", {
    baseline: 0.05,
    shadow: { x: 1 / 3, y: 1 / 12 },
    animations: new Map<string, Frame[]>()
        .set("STAND_FORWARD", [
            { sheet: sheets.dinosaur, col: 2, row: 0 },
        ])
        .set("STAND_BACK", [
            { sheet: sheets.dinosaur, col: 0, row: 0 },
        ])
        .set("STAND_LEFT", [
            { sheet: sheets.dinosaur, col: 1, row: 0, transforms: ["FLIP_H"] },
        ])
        .set("STAND_RIGHT", [
            { sheet: sheets.dinosaur, col: 1, row: 0 },
        ])
        .set("WALK_FORWARD", [
            { sheet: sheets.dinosaur, col: 2, row: 0 },
            { sheet: sheets.dinosaur, col: 2, row: 1 },
            { sheet: sheets.dinosaur, col: 2, row: 2 },
            { sheet: sheets.dinosaur, col: 2, row: 3 },
        ])
        .set("WALK_BACK", [
            { sheet: sheets.dinosaur, col: 0, row: 0 },
            { sheet: sheets.dinosaur, col: 0, row: 1 },
            { sheet: sheets.dinosaur, col: 0, row: 2 },
            { sheet: sheets.dinosaur, col: 0, row: 3 },
        ])
        .set("WALK_LEFT", [
            { sheet: sheets.dinosaur, col: 1, row: 0, transforms: ["FLIP_H"] },
            { sheet: sheets.dinosaur, col: 1, row: 1, transforms: ["FLIP_H"] },
            { sheet: sheets.dinosaur, col: 1, row: 2, transforms: ["FLIP_H"] },
            { sheet: sheets.dinosaur, col: 1, row: 3, transforms: ["FLIP_H"] },
        ])
        .set("WALK_RIGHT", [
            { sheet: sheets.dinosaur, col: 1, row: 0 },
            { sheet: sheets.dinosaur, col: 1, row: 1 },
            { sheet: sheets.dinosaur, col: 1, row: 2 },
            { sheet: sheets.dinosaur, col: 1, row: 3 },
        ])
})

const testSprite = new Sprite("TEST_CARD", {
    baseline: 0,
    shadow: { x: 1 / 3, y: 1 / 12 },
    animations: new Map<string, Frame[]>()
        .set("STAND_FORWARD", [
            { sheet: sheets.testCard },
        ])
        .set("STAND_BACK", [
            { sheet: sheets.testCard },
        ])
        .set("STAND_LEFT", [
            { sheet: sheets.testCard },
        ])
        .set("STAND_RIGHT", [
            { sheet: sheets.testCard },
        ]),
})

const leverSprite = new Sprite("LEVER", {
    size: { x: .3, y: .3 },
    animations: new Map<string, Frame[]>()
        .set("OFF", [
            { sheet: sheets.leverAndButton, col: 0, row: 1, transforms: ["RESIZE_CENTER"] },
        ])
        .set("OFF_LEFT", [
            { sheet: sheets.leverAndButton, col: 0, row: 0, transforms: ["RESIZE_CENTER", "FLIP_H"] },
        ])
        .set("OFF_RIGHT", [
            { sheet: sheets.leverAndButton, col: 0, row: 0, transforms: ["RESIZE_CENTER"] },
        ])
        .set("ON", [
            { sheet: sheets.leverAndButton, col: 2, row: 1, transforms: ["RESIZE_CENTER"] },
        ])
        .set("ON_LEFT", [
            { sheet: sheets.leverAndButton, col: 2, row: 0, transforms: ["RESIZE_CENTER"] },
        ])
        .set("ON_RIGHT", [
            { sheet: sheets.leverAndButton, col: 2, row: 0, transforms: ["RESIZE_CENTER", "FLIP_H"] },
        ])
})

const buttonSprite = new Sprite("BUTTON", {
    size: { x: .4, y: .4 },
    offset: { x: .3, y: .4 },
    animations: new Map<string, Frame[]>()
        .set(Sprite.defaultWallAnimation, [
            { sheet: sheets.leverAndButton, col: 0, row: 2, transforms: ["RESIZE_OFFSET"] },
        ])
})

const doorSprite = new Sprite("DOOR", {
    size: { x: .8, y: .9 },
    offset: { x: .5, y: .55 },
    animations: new Map<string, Frame[]>()
        .set("CLOSED", [
            { sheet: sheets.testCard, transforms: ["RESIZE_OFFSET"] },
        ])
        .set("OPEN", [
            { sheet: sheets.testCard, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"] },
        ])
})





const sprites = {
    brickWall: Sprite.patternSprite("BRICK_WALL", sheets.bricks),
    duckPattern: Sprite.patternSprite("DUCK_PATTERN", sheets.duck_side),
    windowWall: Sprite.patternSprite("WINDOW", sheets.window),
    testPattern: Sprite.patternSprite("TEST", sheets.testCard),
    paintingWall: Sprite.patternSprite("painting", sheets.painting, { size: { x: .5, y: .5 } }),
    duckSprite,
    dinoSprite,
    testSprite,
    leverSprite,
    doorSprite,
    buttonSprite,
}

export {
    spriteSheets,
    sprites,
}