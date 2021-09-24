import { Color } from "@/canvas/Color"
import { Frame, Sprite } from "@/canvas/Sprite"
import { SpriteSheet } from "@/canvas/SpriteSheet"
import { TextBoard } from "@/canvas/TextBoard"


const spriteSheets: SpriteSheet[] = []

const sheets = {

    //https://opengameart.org/content/dinosaur-0
    dinosaur: new SpriteSheet("dinosaur", require("../assets/sprites/dinosaur.png"), spriteSheets, { pattern: "GRID", cols: 3, rows: 4 }),

    //https://opengameart.org/content/old-school-dungeon-crawler-pack
    bricks: new SpriteSheet("bricks", require("../assets/sprites/brick.png"), spriteSheets),
    window: new SpriteSheet("window", require("../assets/sprites/open-window.png"), spriteSheets),

    //https://opengameart.org/content/weird-fruits-16x16
    fruits: new SpriteSheet("fruit", require("../assets/sprites/fruit.png"), spriteSheets, { pattern: "GRID", cols: 4, rows: 4 }),


    //https://opengameart.org/content/wooden-stairs-ns
    stairs: new SpriteSheet("stairs", require("../assets/sprites/wooden_stairs-ns-crop.png"), spriteSheets, { pattern: "GRID", cols: 1, rows: 5 }),

    //https://opengameart.org/content/brick-wall-0
    brickWall2: new SpriteSheet("brickWall", require("../assets/sprites/brick_wall.png"), spriteSheets),

    //https://opengameart.org/content/helmets-64x64
    bardHat: new SpriteSheet("bardHat", require("../assets/sprites/bard-hat.png"), spriteSheets),
    helmet: new SpriteSheet("helmet", require("../assets/sprites/helmet.png"), spriteSheets),

    testCard: new SpriteSheet("testCard", require("../assets/sprites/test-card.png"), spriteSheets),
    painting: new SpriteSheet("painting", require("../assets/sprites/ceiling-small.jpg"), spriteSheets),
    leverAndButton: new SpriteSheet("lever", require("../assets/sprites/lever-and-button.png"), spriteSheets, { pattern: "GRID", cols: 3, rows: 4 }),
    woodenDoor: new SpriteSheet("woodenDoor", require("../assets/sprites/door.png"), spriteSheets, { pattern: "GRID", cols: 2, rows: 3 }),



}



const dinoSprite = new Sprite("DINOSAUR", {
    baseline: .25,
    shadow: { x: 1 / 6, y: 1 / 24 },
    transforms: ["CROP_BASE"],
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
    size: { x: .5, y: .3 },
    animations: new Map<string, Frame[]>()
        .set("OFF", [
            { sheet: sheets.leverAndButton, col: 0, row: 1, transforms: ["RESIZE_CENTER"] },
        ])
        .set("OFF_LEFT", [
            { sheet: sheets.leverAndButton, col: 0, row: 0, transforms: ["RESIZE_CENTER"] },
        ])
        .set("OFF_RIGHT", [
            { sheet: sheets.leverAndButton, col: 0, row: 0, transforms: ["RESIZE_CENTER", "FLIP_H"] },
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

const smallButtonSprite = new Sprite("BUTTON", {
    size: { x: .25, y: .25 },
    offset: { x: .03, y: .4 },
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
            { sheet: sheets.woodenDoor, col: 0, row: 0, transforms: ["RESIZE_OFFSET"] },
        ])
        .set("CLOSED^OPEN", [
            { sheet: sheets.woodenDoor, col: 0, row: 0, transforms: ["RESIZE_OFFSET"] },
            { sheet: sheets.woodenDoor, col: 1, row: 0, transforms: ["RESIZE_OFFSET"] },
            { sheet: sheets.woodenDoor, col: 0, row: 1, transforms: ["RESIZE_OFFSET"] },
            { sheet: sheets.woodenDoor, col: 1, row: 1, transforms: ["RESIZE_OFFSET"] },
            { sheet: sheets.woodenDoor, col: 0, row: 2, transforms: ["RESIZE_OFFSET"] },
            { sheet: sheets.woodenDoor, col: 1, row: 2, transforms: ["RESIZE_OFFSET"] },
        ])
        .set("CLOSED_LEFT", [
            { sheet: sheets.woodenDoor, col: 0, row: 0, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"] },
        ])
        .set("CLOSED^OPEN_LEFT", [
            { sheet: sheets.woodenDoor, col: 0, row: 0, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"] },
            { sheet: sheets.woodenDoor, col: 1, row: 0, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"] },
            { sheet: sheets.woodenDoor, col: 0, row: 1, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"] },
            { sheet: sheets.woodenDoor, col: 1, row: 1, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"] },
            { sheet: sheets.woodenDoor, col: 0, row: 2, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"] },
            { sheet: sheets.woodenDoor, col: 1, row: 2, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"] },
        ])
        .set("CLOSED_RIGHT", [
            { sheet: sheets.woodenDoor, col: 0, row: 0, transforms: ["RESIZE_OFFSET", "SKEW_RIGHT"] },
        ])
        .set("CLOSED^OPEN_RIGHT", [
            { sheet: sheets.woodenDoor, col: 0, row: 0, transforms: ["RESIZE_OFFSET", "SKEW_RIGHT"] },
            { sheet: sheets.woodenDoor, col: 1, row: 0, transforms: ["RESIZE_OFFSET", "SKEW_RIGHT"] },
            { sheet: sheets.woodenDoor, col: 0, row: 1, transforms: ["RESIZE_OFFSET", "SKEW_RIGHT"] },
            { sheet: sheets.woodenDoor, col: 1, row: 1, transforms: ["RESIZE_OFFSET", "SKEW_RIGHT"] },
            { sheet: sheets.woodenDoor, col: 0, row: 2, transforms: ["RESIZE_OFFSET", "SKEW_RIGHT"] },
            { sheet: sheets.woodenDoor, col: 1, row: 2, transforms: ["RESIZE_OFFSET", "SKEW_RIGHT"] },
        ])
        .set("OPEN", [
            { sheet: sheets.woodenDoor, col: 1, row: 2, transforms: ["RESIZE_OFFSET"] },
        ])
        .set("OPEN_LEFT", [
            { sheet: sheets.woodenDoor, col: 1, row: 2, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"] },
        ])
        .set("OPEN_RIGHT", [
            { sheet: sheets.woodenDoor, col: 1, row: 2, transforms: ["RESIZE_OFFSET", "SKEW_RIGHT"] },
        ])
})





const sprites = {
    brickWall: Sprite.patternSprite("BRICK_WALL", sheets.bricks),
    brickWall2: Sprite.patternSprite("BRICK_WALL", sheets.brickWall2),
    windowWall: Sprite.patternSprite("WINDOW", sheets.window),
    testPattern: Sprite.patternSprite("TEST", sheets.testCard),
    paintingWall: Sprite.patternSprite("painting", sheets.painting, { size: { x: .5, y: .35 } }),
    stairs: Sprite.patternSprite("stairs", sheets.stairs, { size: { x: .75, y: 1 } }, { col: 0, row: 0 }),

    dinoSprite,
    testSprite,
    leverSprite,
    doorSprite,
    buttonSprite,
    smallButtonSprite,
    keyHole: new Sprite("KEYHOLE", {
        size: { x: .25, y: .25 }, offset: { x: .05, y: .4 },
        animations: new Map<string, Frame[]>()
            .set(Sprite.defaultWallAnimation, [
                { sheet: sheets.leverAndButton, col: 0, row: 3, transforms: ["RESIZE_OFFSET"] },
            ])
    }),
    apple: Sprite.itemSpriteOneFrame("apple", { sheet: sheets.fruits, col: 0, row: 0 }, { baseline: .1, transforms: ["CROP_BASE",], }),
    bean: Sprite.itemSpriteOneFrame("bean", { sheet: sheets.fruits, col: 1, row: 0 }, { baseline: .1, transforms: ["CROP_BASE",], }),
    key: Sprite.itemSpriteOneFrame("key", { sheet: sheets.fruits, col: 1, row: 2 }, { baseline: .1, transforms: ["CROP_BASE",], }),
    bardHat: Sprite.itemSpriteOneFrame("bardHat", { sheet: sheets.bardHat }, { baseline: .25, transforms: ["CROP_BASE",], }),
    helmet: Sprite.itemSpriteOneFrame("helmet", { sheet: sheets.helmet }, { baseline: .05, transforms: ["CROP_BASE",], }),
}

const textBoards = {

    poem: new TextBoard({
        content: [
            "My name is Ozymandias, King of Kings",
            "Look on my Works, ye Mighty, and despair!"
        ],
        size: { x: .8, y: .5 },
        resolution: 1,
        font: 'fantasy',
        textScale: 1.25,
        backgroundColor: new Color(150, 120, 200)
    }),
    advert: new TextBoard({
        content: [
            "BUY",
            "FISH",
            "HERE",
        ],
        size: { x: .8, y: .5 },
        textScale: 4.5,
    }),
}

export {
    spriteSheets,
    sprites,
    textBoards,
}