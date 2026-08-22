import { Frame, Sprite } from "@/canvas/Sprite"
import { SpriteSheet } from "@/canvas/SpriteSheet"

import orc from "@/travels-in-generica/assets/orc.png"
import trees from "@/travels-in-generica/assets/green-trees.png"
import monk from "@/travels-in-generica/assets/red-monk.png"
import smith from "@/travels-in-generica/assets/smith.png"
import innKeeper from "@/travels-in-generica/assets/innkeeper.png"
import skeletonArcher from "@/travels-in-generica/assets/skeleton-archer.png"
import skeletonSpearman from "@/travels-in-generica/assets/skeleton-spearman.png"
import guard2 from "@/travels-in-generica/assets/guard2.png"
import guard3 from "@/travels-in-generica/assets/guard3.png"
import armedMan from "@/travels-in-generica/assets/armed-man.png"
import farmer from "@/travels-in-generica/assets/farmer.png"
import farmer2 from "@/travels-in-generica/assets/farmer2.png"
import woodenwalls from "@/travels-in-generica/assets/woodenwalls.png"
import woodenFence from "@/travels-in-generica/assets/fence_112x56.png"
import portrait1 from "@/assets/sprites/portraits/Icons_01.png";
import portrait2 from "@/assets/sprites/portraits/Icons_02.png";
import portrait3 from "@/assets/sprites/portraits/Icons_03.png";
import portrait13 from "@/assets/sprites/portraits/Icons_13.png";
import portrait15 from "@/assets/sprites/portraits/Icons_15.png";
import weapons from "@/travels-in-generica/assets/new-weapons.png";
import armour from "@/travels-in-generica/assets/gear_armor.png";
import torch from "@/travels-in-generica/assets/animated_torch.png";
import rubyKey from "@/travels-in-generica/assets/ruby_key.png";


const sheets: { [index: string]: SpriteSheet } = {

    orc: new SpriteSheet("orc", orc, { pattern: "GRID", cols: 13, rows: 21 }),
    smith: new SpriteSheet("smith", smith, { pattern: "GRID", cols: 13, rows: 21 }),
    redMonk: new SpriteSheet("monk", monk, { pattern: "GRID", cols: 13, rows: 21 }),
    innKeeper: new SpriteSheet("innKeeper", innKeeper, { pattern: "GRID", cols: 13, rows: 21 }),
    skeletonArcher: new SpriteSheet("skeletonArcher", skeletonArcher, { pattern: "GRID", cols: 13, rows: 21 }),
    skeletonSpearman: new SpriteSheet("skeletonSpearman", skeletonSpearman, { pattern: "GRID", cols: 13, rows: 21 }),
    guard2: new SpriteSheet("guard2", guard2, { pattern: "GRID", cols: 13, rows: 21 }),
    guard3: new SpriteSheet("guard3", guard3, { pattern: "GRID", cols: 13, rows: 21 }),
    armedMan: new SpriteSheet("armedMan", armedMan, { pattern: "GRID", cols: 13, rows: 21 }),
    farmer: new SpriteSheet("farmer", farmer, { pattern: "GRID", cols: 13, rows: 21 }),
    farmer2: new SpriteSheet("farmer2", farmer2, { pattern: "GRID", cols: 13, rows: 21 }),

    //https://opengameart.org/content/39-portraits-pixel-art-pack
    portrait1: new SpriteSheet("portrait1", portrait1),
    portrait2: new SpriteSheet("portrait2", portrait2),
    portrait3: new SpriteSheet("portrait3", portrait3),
    portrait13: new SpriteSheet("portrait15", portrait13),
    portrait15: new SpriteSheet("portrait15", portrait15),

    //https://opengameart.org/content/32-weapon-icons
    weapons: new SpriteSheet("weapons", weapons, { pattern: "GRID", cols: 17, rows: 2 }),

    //https://opengameart.org/content/lpc-animated-torch
    torch: new SpriteSheet("torch", torch, { pattern: "GRID", cols: 9, rows: 1, }),

    //https://opengameart.org/content/wall-tileset
    woodenWalls: new SpriteSheet("woodenWalls", woodenwalls, { pattern: "GRID", cols: 3, rows: 3 }),

    //https://opengameart.org/content/wooden-fence-2d
    fence: new SpriteSheet("fence", woodenFence),

    //https://opengameart.org/content/lpc-tree-recolors
    trees: new SpriteSheet("trees", trees, { pattern: "GRID", cols: 2, rows: 1 }),

    //https://opengameart.org/content/loyalty-lies-equipment-upper-body-armour
    armour: new SpriteSheet("armour", armour, { pattern: "GRID", cols: 13, rows: 1 }),


    //https://opengameart.org/content/gemmed-items
    rubyKey: new SpriteSheet("rubyKey", rubyKey),
}

const spriteSheets = Object.keys(sheets).map(key => sheets[key])

function makeULpcSprite(name: string, sheet: SpriteSheet): Sprite {

    function makeRow(row: number, lastCol: number, firstCol = 0): Frame[] {
        const output: Frame[] = []
        for (let index = firstCol; index < lastCol; index++) {
            output.push({ sheet, row, col: index })
        }
        return output
    }

    function makeMixedRow(row: number, columnList: number[], sheet: SpriteSheet): Frame[] {
        const output: Frame[] = []
        for (let index = 0; index < columnList.length; index++) {
            output.push({ sheet, row, col: columnList[index] })
        }
        return output
    }

    return new Sprite(name, {
        baseline: .26,
        shadow: { x: 1 / 10, y: 1 / 26 },
        size: { x: .5, y: .5 },
        transforms: ["RESIZE_CENTER", "CROP_BASE"],
        animations: new Map<string, Frame[]>()
            .set("STAND_FORWARD", [
                { sheet: sheet, col: 0, row: 8 },
            ])
            .set("STAND_LEFT", [
                { sheet: sheet, col: 0, row: 9 },
            ])
            .set("STAND_BACK", [
                { sheet: sheet, col: 0, row: 10 },
            ])
            .set("STAND_RIGHT", [
                { sheet: sheet, col: 0, row: 11 },
            ])
            .set("WALK_FORWARD", makeRow(8, 8, 1))
            .set("WALK_LEFT", makeRow(9, 8, 1))
            .set("WALK_BACK", makeRow(10, 8, 1))
            .set("WALK_RIGHT", makeRow(11, 8, 1))
            .set("ATTACK_FORWARD", makeRow(4, 7))
            .set("ATTACK_LEFT", makeRow(5, 7))
            .set("ATTACK_BACK", makeRow(6, 7))
            .set("ATTACK_RIGHT", makeRow(7, 7))
            .set("ATTACK_SWING_FORWARD", makeRow(12, 5))
            .set("ATTACK_SWING_LEFT", makeRow(13, 5))
            .set("ATTACK_SWING_BACK", makeRow(14, 5))
            .set("ATTACK_SWING_RIGHT", makeRow(15, 5))
            .set("DIE", [...makeRow(20, 4),
            { sheet: sheet, col: 4, row: 20 },
            { sheet: sheet, col: 4, row: 20 },
            ])
            .set("hurt", [...makeRow(20, 3)])
            .set("TALK_FORWARD", makeMixedRow(0, [0, 1, 6, 3, 6, 1, 0, 1, 6, 3, 6, 1], sheet))
            .set("TALK_LEFT", makeMixedRow(1, [0, 1, 6, 3, 6, 1, 0, 1, 6, 3, 6, 1], sheet))
            .set("TALK_BACK", makeMixedRow(2, [0, 1, 6, 3, 6, 1, 0, 1, 6, 3, 6, 1], sheet))
            .set("TALK_RIGHT", makeMixedRow(3, [0, 1, 6, 3, 6, 1, 0, 1, 6, 3, 6, 1], sheet))

    })
}


const sprites = {
    smith: makeULpcSprite("SMITH", sheets.smith),
    redMonk: makeULpcSprite("REDMONK", sheets.redMonk),
    innKeeper: makeULpcSprite("innKeeper", sheets.innKeeper),
    guard2: makeULpcSprite("guard2", sheets.guard2),
    guard3: makeULpcSprite("guard3", sheets.guard3),
    armedMan: makeULpcSprite("armedMan", sheets.armedMan),
    farmer: makeULpcSprite("farmer", sheets.farmer),
    farmer2: makeULpcSprite("farmer", sheets.farmer2),
    orc: makeULpcSprite("ORC", sheets.orc),
    skeletonArcher: makeULpcSprite("skeletonArcher", sheets.skeletonArcher),
    skeletonSpearman: makeULpcSprite("skeletonSpearman", sheets.skeletonSpearman),

    drake_portrait: Sprite.portraitSprite("drake", sheets.portrait1),
    sally_portrait: Sprite.portraitSprite("sally", sheets.portrait2),
    boblin_portrait: Sprite.portraitSprite("boblin", sheets.portrait3),
    gwim_portrait: Sprite.portraitSprite("gwim", sheets.portrait13),

    silverSword: Sprite.itemSpriteOneFrame("silverSword", { sheet: sheets.weapons, col: 1, row: 0 }),
    hammer: Sprite.itemSpriteOneFrame("hammer", { sheet: sheets.weapons, col: 14, row: 0 }),
    stick: Sprite.itemSpriteOneFrame("stick", { sheet: sheets.weapons, col: 3, row: 1 }),
    mailShirt: Sprite.itemSpriteOneFrame("mailShirt", { sheet: sheets.armour, col: 7, row: 0 }),
    plateArmour: Sprite.itemSpriteOneFrame("plateArmour", { sheet: sheets.armour, col: 8, row: 0 }),
    rubyKey: Sprite.itemSpriteOneFrame("rubyKey", { sheet: sheets.rubyKey }),

    torch: Sprite.animatedPatternSprite('torch', sheets.torch, { size: { x: .25, y: .5 } }),

    brownWoodWallOne: Sprite.patternSprite('brownWoodWallOne', sheets.woodenWalls, {}, { row: 2, col: 0 }),
    yellowWoodWallOne: Sprite.patternSprite('yellowWoodWallOne', sheets.woodenWalls, {}, { row: 2, col: 1 }),
    grayWoodWallOne: Sprite.patternSprite('grayWoodWallOne', sheets.woodenWalls, {}, { row: 2, col: 2 }),
    fence: Sprite.patternSprite('fence', sheets.fence, { size: { x: 1, y: .5 }, offset: { x: 0.5, y: 0.75 } },),
    treeOne: new Sprite('treeOne', {
        plotShift: { x: -0.1, y: 0.175 },
        size: { x: 1, y: 1 },
        animations: new Map<string, Frame[]>()
            .set("STAND_FORWARD", [{ sheet: sheets.trees, col: 1 }])
            .set("STAND_BACK", [{ sheet: sheets.trees, col: 1, transforms: ["FLIP_H"] }])
            .set("STAND_LEFT", [{ sheet: sheets.trees, col: 0 }])
            .set("STAND_RIGHT", [{ sheet: sheets.trees, col: 0, transforms: ["FLIP_H"] }])
    }),
    treeTwo: new Sprite('treeTwo', {
        plotShift: { x: -0.025, y: 0.175 },
        size: { x: .7, y: .7 },
        animations: new Map<string, Frame[]>()
            .set("STAND", [{ sheet: sheets.trees, col: 1 }])
            .set("STAND_BACK", [{ sheet: sheets.trees, col: 1, transforms: ["FLIP_H"] }])
            .set("STAND_LEFT", [{ sheet: sheets.trees, col: 1, transforms: ["FLIP_H"] }])
    })
}

export {
    spriteSheets,
    sprites,
}