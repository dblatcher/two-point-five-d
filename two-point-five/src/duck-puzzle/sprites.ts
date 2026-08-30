import { Frame, Sprite } from "@/canvas/Sprite"
import { SpriteSheet } from "@/canvas/SpriteSheet"
//https://opengameart.org/content/cute-duck-animated-set
import duck_front from "./assets/duck/walk/front/1.png";
import duck_side from "./assets/duck/walk/side/1.png";
import duck_back from "./assets/duck/walk/back/1.png";
import duck_front_walk_1 from "./assets/duck/walk/front/1.png";
import duck_front_walk_2 from "./assets/duck/walk/front/2.png";
import duck_front_walk_3 from "./assets/duck/walk/front/3.png";
import duck_front_walk_4 from "./assets/duck/walk/front/4.png";
import duck_back_walk_1 from "./assets/duck/walk/back/1.png";
import duck_back_walk_2 from "./assets/duck/walk/back/2.png";
import duck_back_walk_3 from "./assets/duck/walk/back/3.png";
import duck_back_walk_4 from "./assets/duck/walk/back/4.png";
import duck_side_walk_1 from "./assets/duck/walk/side/1.png";
import duck_side_walk_2 from "./assets/duck/walk/side/2.png";
import duck_side_walk_3 from "./assets/duck/walk/side/3.png";
import duck_side_walk_4 from "./assets/duck/walk/side/4.png";
import duck_side_walk_5 from "./assets/duck/walk/side/5.png";
import duck_side_walk_6 from "./assets/duck/walk/side/6.png";
import duck_side_walk_7 from "./assets/duck/walk/side/7.png";
//https://opengameart.org/content/old-school-dungeon-crawler-pack
import bricksImg from "../assets/sprites/brick.png";
import windowImg from "../assets/sprites/open-window.png";
import weightImg from "./assets/weight.png";


const sheets: { [index: string]: SpriteSheet } = {
    duck_front: new SpriteSheet("duck-front", duck_front),
    duck_side: new SpriteSheet("duck-side", duck_side),
    duck_back: new SpriteSheet("duck-back", duck_back),
    duck_walk_front_1: new SpriteSheet("duck-front-walk-1", duck_front_walk_1),
    duck_walk_front_2: new SpriteSheet("duck-front-walk-2", duck_front_walk_2),
    duck_walk_front_3: new SpriteSheet("duck-front-walk-3", duck_front_walk_3),
    duck_walk_front_4: new SpriteSheet("duck-front-walk-4", duck_front_walk_4),
    duck_walk_back_1: new SpriteSheet("duck-back-walk-1", duck_back_walk_1),
    duck_walk_back_2: new SpriteSheet("duck-back-walk-2", duck_back_walk_2),
    duck_walk_back_3: new SpriteSheet("duck-back-walk-3", duck_back_walk_3),
    duck_walk_back_4: new SpriteSheet("duck-back-walk-4", duck_back_walk_4),
    duck_walk_side_1: new SpriteSheet("duck-side-walk-1", duck_side_walk_1),
    duck_walk_side_2: new SpriteSheet("duck-side-walk-2", duck_side_walk_2),
    duck_walk_side_3: new SpriteSheet("duck-side-walk-3", duck_side_walk_3),
    duck_walk_side_4: new SpriteSheet("duck-side-walk-4", duck_side_walk_4),
    duck_walk_side_5: new SpriteSheet("duck-side-walk-5", duck_side_walk_5),
    duck_walk_side_6: new SpriteSheet("duck-side-walk-6", duck_side_walk_6),
    duck_walk_side_7: new SpriteSheet("duck-side-walk-7", duck_side_walk_7),


    //https://opengameart.org/content/old-school-dungeon-crawler-pack
    bricks: new SpriteSheet("bricks", bricksImg),
    window: new SpriteSheet("window", windowImg),
    weight: new SpriteSheet("weight", weightImg, { pattern: "GRID", cols: 2, rows: 2 }),

}

const spriteSheets = Object.keys(sheets).map(key => sheets[key])

const duckSprite = new Sprite({
    id: "DUCK",
    shadow: { x: 1 / 4, y: 1 / 12 },
    animations: new Map<string, Frame[]>()
        .set("STAND_FORWARD", [
            { sheet: sheets.duck_back.id },
        ])
        .set("STAND_BACK", [
            { sheet: sheets.duck_front.id },
        ])
        .set("STAND_LEFT", [
            { sheet: sheets.duck_side.id },
        ])
        .set("STAND_RIGHT", [
            { sheet: sheets.duck_side.id, transforms: ["FLIP_H"] },
        ])
        .set("WALK_FORWARD", [
            { sheet: sheets.duck_walk_back_1.id },
            { sheet: sheets.duck_walk_back_2.id },
            { sheet: sheets.duck_walk_back_3.id },
            { sheet: sheets.duck_walk_back_4.id },
        ])
        .set("WALK_BACK", [
            { sheet: sheets.duck_walk_front_1.id },
            { sheet: sheets.duck_walk_front_2.id },
            { sheet: sheets.duck_walk_front_3.id },
            { sheet: sheets.duck_walk_front_4.id },
        ])
        .set("WALK_LEFT", [
            { sheet: sheets.duck_walk_side_1.id },
            { sheet: sheets.duck_walk_side_2.id },
            { sheet: sheets.duck_walk_side_3.id },
            { sheet: sheets.duck_walk_side_4.id },
            { sheet: sheets.duck_walk_side_5.id },
            { sheet: sheets.duck_walk_side_6.id },
            { sheet: sheets.duck_walk_side_7.id },
        ])
        .set("WALK_RIGHT", [
            { sheet: sheets.duck_walk_side_1.id, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_2.id, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_3.id, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_4.id, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_5.id, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_6.id, transforms: ["FLIP_H"] },
            { sheet: sheets.duck_walk_side_7.id, transforms: ["FLIP_H"] },
        ])
})


const weight = Sprite.itemSpriteDirectional({
    back: [{ sheet: sheets.weight.id, row: 0, col: 1, }],
    left: [{ sheet: sheets.weight.id, row: 1, col: 1, }],
    forward: [{ sheet: sheets.weight.id, row: 0, col: 0, }],
    right: [{ sheet: sheets.weight.id, row: 1, col: 0, }],
}, {
    id: "WEIGHT",
    baseline: .08,
    transforms: ["CROP_BASE",],
})

const weightIcon = Sprite.itemSpriteOneFrame({ sheet: sheets.weight.id, row: 0, col: 0, }, { id: "WEIGHT_ICON", })

const sprites = {
    brickWall: Sprite.patternSprite(sheets.bricks.id, { id: "BRICK_WALL" }),
    duckPattern: Sprite.patternSprite(sheets.duck_side.id, { id: "DUCK_PATTERN" }),
    windowWall: Sprite.patternSprite(sheets.window.id, { id: "WINDOW" }),
    weight, weightIcon,
    duckSprite,
}


export {
    spriteSheets,
    sprites,
}