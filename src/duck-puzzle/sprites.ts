
import { Frame, Sprite, SpriteSheet } from "@/canvas/Sprite"



const spriteSheets: SpriteSheet[] = []

const sheets = {
    //https://opengameart.org/content/cute-duck-animated-set
    duck_front: new SpriteSheet("duck-front", require("./assets/duck/walk/front/1.png"), spriteSheets),
    duck_side: new SpriteSheet("duck-side", require("./assets/duck/walk/side/1.png"), spriteSheets),
    duck_back: new SpriteSheet("duck-back", require("./assets/duck/walk/back/1.png"), spriteSheets),
    duck_walk_front_1: new SpriteSheet("duck-front-walk-1", require("./assets/duck/walk/front/1.png"), spriteSheets),
    duck_walk_front_2: new SpriteSheet("duck-front-walk-2", require("./assets/duck/walk/front/2.png"), spriteSheets),
    duck_walk_front_3: new SpriteSheet("duck-front-walk-3", require("./assets/duck/walk/front/3.png"), spriteSheets),
    duck_walk_front_4: new SpriteSheet("duck-front-walk-4", require("./assets/duck/walk/front/4.png"), spriteSheets),
    duck_walk_back_1: new SpriteSheet("duck-back-walk-1", require("./assets/duck/walk/back/1.png"), spriteSheets),
    duck_walk_back_2: new SpriteSheet("duck-back-walk-2", require("./assets/duck/walk/back/2.png"), spriteSheets),
    duck_walk_back_3: new SpriteSheet("duck-back-walk-3", require("./assets/duck/walk/back/3.png"), spriteSheets),
    duck_walk_back_4: new SpriteSheet("duck-back-walk-4", require("./assets/duck/walk/back/4.png"), spriteSheets),
    duck_walk_side_1: new SpriteSheet("duck-side-walk-1", require("./assets/duck/walk/side/1.png"), spriteSheets),
    duck_walk_side_2: new SpriteSheet("duck-side-walk-2", require("./assets/duck/walk/side/2.png"), spriteSheets),
    duck_walk_side_3: new SpriteSheet("duck-side-walk-3", require("./assets/duck/walk/side/3.png"), spriteSheets),
    duck_walk_side_4: new SpriteSheet("duck-side-walk-4", require("./assets/duck/walk/side/4.png"), spriteSheets),
    duck_walk_side_5: new SpriteSheet("duck-side-walk-5", require("./assets/duck/walk/side/5.png"), spriteSheets),
    duck_walk_side_6: new SpriteSheet("duck-side-walk-6", require("./assets/duck/walk/side/6.png"), spriteSheets),
    duck_walk_side_7: new SpriteSheet("duck-side-walk-7", require("./assets/duck/walk/side/7.png"), spriteSheets),


    //https://opengameart.org/content/old-school-dungeon-crawler-pack
    bricks: new SpriteSheet("bricks", require("../assets/sprites/brick.png"), spriteSheets),
    window: new SpriteSheet("window", require("../assets/sprites/open-window.png"), spriteSheets),
    weight: new SpriteSheet("weight", require("./assets/weight.png"), spriteSheets, { pattern: "GRID", cols: 2, rows: 2 }),

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


const weight = Sprite.itemSpriteDirectional("WEIGHT", {
    back: [{ sheet: sheets.weight, row: 0, col: 1, }],
    left: [{ sheet: sheets.weight, row: 1, col: 1, }],
    forward: [{ sheet: sheets.weight, row: 0, col: 0, }],
    right: [{ sheet: sheets.weight, row: 1, col: 0, }],
}, {
    baseline: .08,
    transforms: ["CROP_BASE",],
})

const weightIcon = Sprite.itemSpriteOneFrame("WEIGHT_ICON", { sheet: sheets.weight, row: 0, col: 0, })

const sprites = {
    brickWall: Sprite.patternSprite("BRICK_WALL", sheets.bricks),
    duckPattern: Sprite.patternSprite("DUCK_PATTERN", sheets.duck_side),
    windowWall: Sprite.patternSprite("WINDOW", sheets.window),
    weight, weightIcon,
    duckSprite,
}


export {
    spriteSheets,
    sprites,
}