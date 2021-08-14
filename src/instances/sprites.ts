import { Color } from "@/canvas/Color"
import { Frame, Sprite, SpriteSheet } from "@/canvas/Sprite"
import { TextBoard } from "@/canvas/TextBoard"


const spriteSheets: SpriteSheet[] = []

const sheets = {
    //https://opengameart.org/content/cute-duck-animated-set
    duck_front: new SpriteSheet("duck-front", require("../assets/sprites/duck-front.png"), spriteSheets),
    duck_side: new SpriteSheet("duck-side", require("../assets/sprites/duck-side.png"), spriteSheets),
    duck_back: new SpriteSheet("duck-back", require("../assets/sprites/duck-back.png"), spriteSheets),
    duck_walk_front_1: new SpriteSheet("duck-front-walk-1", require("../assets/sprites/duck/walk/front/1.png"), spriteSheets),
    duck_walk_front_2: new SpriteSheet("duck-front-walk-2", require("../assets/sprites/duck/walk/front/2.png"), spriteSheets),
    duck_walk_front_3: new SpriteSheet("duck-front-walk-3", require("../assets/sprites/duck/walk/front/3.png"), spriteSheets),
    duck_walk_front_4: new SpriteSheet("duck-front-walk-4", require("../assets/sprites/duck/walk/front/4.png"), spriteSheets),
    duck_walk_back_1: new SpriteSheet("duck-back-walk-1", require("../assets/sprites/duck/walk/back/1.png"), spriteSheets),
    duck_walk_back_2: new SpriteSheet("duck-back-walk-2", require("../assets/sprites/duck/walk/back/2.png"), spriteSheets),
    duck_walk_back_3: new SpriteSheet("duck-back-walk-3", require("../assets/sprites/duck/walk/back/3.png"), spriteSheets),
    duck_walk_back_4: new SpriteSheet("duck-back-walk-4", require("../assets/sprites/duck/walk/back/4.png"), spriteSheets),
    duck_walk_side_1: new SpriteSheet("duck-side-walk-1", require("../assets/sprites/duck/walk/side/1.png"), spriteSheets),
    duck_walk_side_2: new SpriteSheet("duck-side-walk-2", require("../assets/sprites/duck/walk/side/2.png"), spriteSheets),
    duck_walk_side_3: new SpriteSheet("duck-side-walk-3", require("../assets/sprites/duck/walk/side/3.png"), spriteSheets),
    duck_walk_side_4: new SpriteSheet("duck-side-walk-4", require("../assets/sprites/duck/walk/side/4.png"), spriteSheets),
    duck_walk_side_5: new SpriteSheet("duck-side-walk-5", require("../assets/sprites/duck/walk/side/5.png"), spriteSheets),
    duck_walk_side_6: new SpriteSheet("duck-side-walk-6", require("../assets/sprites/duck/walk/side/6.png"), spriteSheets),
    duck_walk_side_7: new SpriteSheet("duck-side-walk-7", require("../assets/sprites/duck/walk/side/7.png"), spriteSheets),

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

    //https://opengameart.org/content/39-portraits-pixel-art-pack
    portrait1: new SpriteSheet("portrait1", require("../assets/sprites/portraits/Icons_01.png"), spriteSheets),
    portrait2: new SpriteSheet("portrait2", require("../assets/sprites/portraits/Icons_02.png"), spriteSheets),
    portrait3: new SpriteSheet("portrait3", require("../assets/sprites/portraits/Icons_03.png"), spriteSheets),
    portrait13: new SpriteSheet("portrait15", require("../assets/sprites/portraits/Icons_13.png"), spriteSheets),
    portrait15: new SpriteSheet("portrait15", require("../assets/sprites/portraits/Icons_15.png"), spriteSheets),

}


const duckSprite = new Sprite("DUCK", {
    shadow: { x: 1 / 4, y: 1 / 12 },
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
        ])
        .set("WALK_FORWARD", [
            { sheet: sheets.duck_walk_back_1 },
            { sheet: sheets.duck_walk_back_2 },
            { sheet: sheets.duck_walk_back_3 },
            { sheet: sheets.duck_walk_back_4 },
        ])
        .set("WALK_BACK", [
            { sheet: sheets.duck_walk_front_1 },
            { sheet: sheets.duck_walk_front_2 },
            { sheet: sheets.duck_walk_front_3 },
            { sheet: sheets.duck_walk_front_4 },
        ])
        .set("WALK_LEFT", [
            { sheet: sheets.duck_walk_side_1 },
            { sheet: sheets.duck_walk_side_2 },
            { sheet: sheets.duck_walk_side_3 },
            { sheet: sheets.duck_walk_side_4 },
            { sheet: sheets.duck_walk_side_5 },
            { sheet: sheets.duck_walk_side_6 },
            { sheet: sheets.duck_walk_side_7 },
        ])
        .set("WALK_RIGHT", [
            { sheet: sheets.duck_walk_side_1, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_2, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_3, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_4, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_5, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_6, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_7, transforms: ["FLIP_H"] },
        ])
})


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
    duckPattern: Sprite.patternSprite("DUCK_PATTERN", sheets.duck_side),
    windowWall: Sprite.patternSprite("WINDOW", sheets.window),
    testPattern: Sprite.patternSprite("TEST", sheets.testCard),
    paintingWall: Sprite.patternSprite("painting", sheets.painting, { size: { x: .5, y: .35 } }),
    stairs: Sprite.patternSprite("stairs", sheets.stairs, { size: { x: .75, y: 1 } }, { col: 0, row: 0 }),
    duckSprite,
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
    apple: Sprite.itemSprite("apple", { sheet: sheets.fruits, col: 0, row: 0 }, { baseline: .1, transforms: ["CROP_BASE",], }),
    bean: Sprite.itemSprite("bean", { sheet: sheets.fruits, col: 1, row: 0 }, { baseline: .1, transforms: ["CROP_BASE",], }),
    key: Sprite.itemSprite("key", { sheet: sheets.fruits, col: 1, row: 2 }, { baseline: .1, transforms: ["CROP_BASE",], }),
    bardHat: Sprite.itemSprite("bardHat", { sheet: sheets.bardHat }, { baseline: .25, transforms: ["CROP_BASE",], }),
    helmet: Sprite.itemSprite("helmet", { sheet: sheets.helmet }, { baseline: .05, transforms: ["CROP_BASE",], }),

    drake_portrait: Sprite.portraitSprite("drake", sheets.portrait1),
    sally_portrait: Sprite.portraitSprite("sally", sheets.portrait2),
    boblin_portrait: Sprite.portraitSprite("boblin", sheets.portrait3),
    gwim_portrait: Sprite.portraitSprite("gwim", sheets.portrait13),
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