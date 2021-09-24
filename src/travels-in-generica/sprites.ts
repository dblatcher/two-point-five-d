import { Frame, Sprite } from "@/canvas/Sprite"
import { SpriteSheet } from "@/canvas/SpriteSheet"


const sheets:{[index:string]:SpriteSheet} = {

    orc: new SpriteSheet("orc", require("./assets/orc.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    smith: new SpriteSheet("smith", require("./assets/smith.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    redMonk: new SpriteSheet("monk", require("./assets/red-monk.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    innKeeper: new SpriteSheet("innKeeper", require("./assets/innkeeper.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    skeletonArcher: new SpriteSheet("skeletonArcher", require("./assets/skeleton-archer.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    skeletonSpearman: new SpriteSheet("skeletonSpearman", require("./assets/skeleton-spearman.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    guard2: new SpriteSheet("guard2", require("./assets/guard2.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    guard3: new SpriteSheet("guard3", require("./assets/guard3.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    armedMan: new SpriteSheet("armedMan", require("./assets/armed-man.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    farmer: new SpriteSheet("farmer", require("./assets/farmer.png"), { pattern: "GRID", cols: 13, rows: 21 }),
    farmer2: new SpriteSheet("farmer2", require("./assets/farmer2.png"), { pattern: "GRID", cols: 13, rows: 21 }),

    //https://opengameart.org/content/39-portraits-pixel-art-pack
    portrait1: new SpriteSheet("portrait1", require("../assets/sprites/portraits/Icons_01.png")),
    portrait2: new SpriteSheet("portrait2", require("../assets/sprites/portraits/Icons_02.png")),
    portrait3: new SpriteSheet("portrait3", require("../assets/sprites/portraits/Icons_03.png")),
    portrait13: new SpriteSheet("portrait15", require("../assets/sprites/portraits/Icons_13.png")),
    portrait15: new SpriteSheet("portrait15", require("../assets/sprites/portraits/Icons_15.png")),

    //https://opengameart.org/content/32-weapon-icons
    weapons: new SpriteSheet("weapons", require("./assets/new-weapons.png"), { pattern: "GRID", cols: 17, rows: 2 }),

    //https://opengameart.org/content/lpc-animated-torch
    torch: new SpriteSheet("torch", require("./assets/animated_torch.png"), { pattern: "GRID", cols: 9, rows: 1, }),

    //https://opengameart.org/content/wall-tileset
    woodenWalls: new SpriteSheet("woodenWalls", require("./assets/woodenwalls.png"), { pattern: "GRID", cols: 3, rows: 3 }),

    //https://opengameart.org/content/wooden-fence-2d
    fence: new SpriteSheet("fence", require("./assets/fence_112x56.png")),

    //https://opengameart.org/content/lpc-tree-recolors
    trees: new SpriteSheet("trees", require("./assets/green-trees.png"), { pattern: "GRID", cols: 2, rows: 1 }),

    //https://opengameart.org/content/loyalty-lies-equipment-upper-body-armour
    armour: new SpriteSheet("armour", require("./assets/gear_armor.png"), { pattern: "GRID", cols: 13, rows: 1 }),


    //https://opengameart.org/content/gemmed-items
    rubyKey: new SpriteSheet("rubyKey", require("./assets/ruby_key.png")),
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
    rubyKey: Sprite.itemSpriteOneFrame("rubyKey",{sheet:sheets.rubyKey}),

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