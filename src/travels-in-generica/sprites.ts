import { Frame, Sprite, SpriteSheet } from "@/canvas/Sprite"


const spriteSheets: SpriteSheet[] = []

const sheets = {
    //https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
    skeleton_walk: new SpriteSheet("skeleton_walk", require("../assets/sprites/skeleton/walk.png"), spriteSheets, { pattern: "GRID", cols: 9, rows: 4 }),
    skeleton_slash: new SpriteSheet("skeleton_slash", require("../assets/sprites/skeleton/slash.png"), spriteSheets, { pattern: "GRID", cols: 6, rows: 4 }),
    farmer_walk: new SpriteSheet("farmer_walk", require("../assets/sprites/farmer/walk.png"), spriteSheets, { pattern: "GRID", cols: 9, rows: 4 }),
    farmer_slash: new SpriteSheet("farmer_slash", require("../assets/sprites/farmer/slash.png"), spriteSheets, { pattern: "GRID", cols: 6, rows: 4 }),
    guard_walk: new SpriteSheet("guard_walk", require("../assets/sprites/guard/walk.png"), spriteSheets, { pattern: "GRID", cols: 9, rows: 4 }),
    guard_slash: new SpriteSheet("guard_slash", require("../assets/sprites/guard/slash.png"), spriteSheets, { pattern: "GRID", cols: 6, rows: 4 }),
    fighter_walk: new SpriteSheet("fighter_walk", require("../assets/sprites/fighter/walk.png"), spriteSheets, { pattern: "GRID", cols: 9, rows: 4 }),
    fighter_slash: new SpriteSheet("fighter_slash", require("../assets/sprites/fighter/slash.png"), spriteSheets, { pattern: "GRID", cols: 6, rows: 4 }),

    orc: new SpriteSheet("orc", require("./assets/orc.png"), spriteSheets, { pattern: "GRID", cols: 13, rows: 21 }),
    smith: new SpriteSheet("smith", require("./assets/smith.png"), spriteSheets, { pattern: "GRID", cols: 13, rows: 21 }),
    redMonk: new SpriteSheet("monk", require("./assets/red-monk.png"), spriteSheets, { pattern: "GRID", cols: 13, rows: 21 }),
    innKeeper: new SpriteSheet("innKeeper", require("./assets/innkeeper.png"), spriteSheets, { pattern: "GRID", cols: 13, rows: 21 }),
    skeletonArcher: new SpriteSheet("skeletonArcher", require("./assets/skeleton-archer.png"), spriteSheets, { pattern: "GRID", cols: 13, rows: 21 }),
    skeletonSpearman: new SpriteSheet("skeletonSpearman", require("./assets/skeleton-spearman.png"), spriteSheets, { pattern: "GRID", cols: 13, rows: 21 }),

    //https://opengameart.org/content/39-portraits-pixel-art-pack
    portrait1: new SpriteSheet("portrait1", require("../assets/sprites/portraits/Icons_01.png"), spriteSheets),
    portrait2: new SpriteSheet("portrait2", require("../assets/sprites/portraits/Icons_02.png"), spriteSheets),
    portrait3: new SpriteSheet("portrait3", require("../assets/sprites/portraits/Icons_03.png"), spriteSheets),
    portrait13: new SpriteSheet("portrait15", require("../assets/sprites/portraits/Icons_13.png"), spriteSheets),
    portrait15: new SpriteSheet("portrait15", require("../assets/sprites/portraits/Icons_15.png"), spriteSheets),

    //https://opengameart.org/content/32-weapon-icons
    weapons: new SpriteSheet("weapons", require("./assets/new-weapons.png"), spriteSheets, { pattern: "GRID", cols: 17, rows: 2 }),
}

function makeLpcSprite(name: string, walkSheet: SpriteSheet, slashSheet: SpriteSheet): Sprite {

    return new Sprite(name, {
        baseline: .26,
        shadow: { x: 1 / 10, y: 1 / 26 },
        size: { x: .5, y: .5 },
        transforms: ["RESIZE_CENTER", "CROP_BASE"],
        animations: new Map<string, Frame[]>()
            .set("STAND_FORWARD", [
                { sheet: walkSheet, col: 0, row: 0 },
            ])
            .set("STAND_LEFT", [
                { sheet: walkSheet, col: 0, row: 1 },
            ])
            .set("STAND_BACK", [
                { sheet: walkSheet, col: 0, row: 2 },
            ])
            .set("STAND_RIGHT", [
                { sheet: walkSheet, col: 0, row: 3 },
            ])
            .set("WALK_FORWARD", [
                { sheet: walkSheet, col: 1, row: 0 },
                { sheet: walkSheet, col: 2, row: 0 },
                { sheet: walkSheet, col: 3, row: 0 },
                { sheet: walkSheet, col: 4, row: 0 },
                { sheet: walkSheet, col: 5, row: 0 },
                { sheet: walkSheet, col: 6, row: 0 },
                { sheet: walkSheet, col: 7, row: 0 },
                { sheet: walkSheet, col: 8, row: 0 },
            ])
            .set("WALK_LEFT", [
                { sheet: walkSheet, col: 1, row: 1 },
                { sheet: walkSheet, col: 2, row: 1 },
                { sheet: walkSheet, col: 3, row: 1 },
                { sheet: walkSheet, col: 4, row: 1 },
                { sheet: walkSheet, col: 5, row: 1 },
                { sheet: walkSheet, col: 6, row: 1 },
                { sheet: walkSheet, col: 7, row: 1 },
                { sheet: walkSheet, col: 8, row: 1 },
            ])
            .set("WALK_BACK", [
                { sheet: walkSheet, col: 1, row: 2 },
                { sheet: walkSheet, col: 2, row: 2 },
                { sheet: walkSheet, col: 3, row: 2 },
                { sheet: walkSheet, col: 4, row: 2 },
                { sheet: walkSheet, col: 5, row: 2 },
                { sheet: walkSheet, col: 6, row: 2 },
                { sheet: walkSheet, col: 7, row: 2 },
                { sheet: walkSheet, col: 8, row: 2 },
            ])
            .set("WALK_RIGHT", [
                { sheet: walkSheet, col: 1, row: 3 },
                { sheet: walkSheet, col: 2, row: 3 },
                { sheet: walkSheet, col: 3, row: 3 },
                { sheet: walkSheet, col: 4, row: 3 },
                { sheet: walkSheet, col: 5, row: 3 },
                { sheet: walkSheet, col: 6, row: 3 },
                { sheet: walkSheet, col: 7, row: 3 },
                { sheet: walkSheet, col: 8, row: 3 },
            ])
            .set("ATTACK_FORWARD", [
                { sheet: slashSheet, col: 0, row: 0 },
                { sheet: slashSheet, col: 1, row: 0 },
                { sheet: slashSheet, col: 2, row: 0 },
                { sheet: slashSheet, col: 3, row: 0 },
                { sheet: slashSheet, col: 4, row: 0 },
                { sheet: slashSheet, col: 5, row: 0 },

            ])
            .set("ATTACK_LEFT", [
                { sheet: slashSheet, col: 0, row: 1 },
                { sheet: slashSheet, col: 1, row: 1 },
                { sheet: slashSheet, col: 2, row: 1 },
                { sheet: slashSheet, col: 3, row: 1 },
                { sheet: slashSheet, col: 4, row: 1 },
                { sheet: slashSheet, col: 5, row: 1 },

            ])
            .set("ATTACK_BACK", [
                { sheet: slashSheet, col: 0, row: 2 },
                { sheet: slashSheet, col: 1, row: 2 },
                { sheet: slashSheet, col: 2, row: 2 },
                { sheet: slashSheet, col: 3, row: 2 },
                { sheet: slashSheet, col: 4, row: 2 },
                { sheet: slashSheet, col: 5, row: 2 },
            ])
            .set("ATTACK_RIGHT", [
                { sheet: slashSheet, col: 0, row: 3 },
                { sheet: slashSheet, col: 1, row: 3 },
                { sheet: slashSheet, col: 2, row: 3 },
                { sheet: slashSheet, col: 3, row: 3 },
                { sheet: slashSheet, col: 4, row: 3 },
                { sheet: slashSheet, col: 5, row: 3 },
            ])
    })
}

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
    skeletonSprite: makeLpcSprite("SKELETON", sheets.skeleton_walk, sheets.skeleton_slash),
    farmerSprite: makeLpcSprite("FARMER", sheets.farmer_walk, sheets.farmer_slash),
    guardSprite: makeLpcSprite("GUARD", sheets.guard_walk, sheets.guard_slash),
    fighterSprite: makeLpcSprite("FIGHTER", sheets.fighter_walk, sheets.fighter_slash),

    orc: makeULpcSprite("ORC", sheets.orc),
    smith: makeULpcSprite("SMITH", sheets.smith),
    redMonk: makeULpcSprite("REDMONK", sheets.redMonk),
    innKeeper: makeULpcSprite("innKeeper", sheets.innKeeper),
    skeletonArcher: makeULpcSprite("skeletonArcher", sheets.skeletonArcher),
    skeletonSpearman: makeULpcSprite("skeletonSpearman", sheets.skeletonSpearman),

    drake_portrait: Sprite.portraitSprite("drake", sheets.portrait1),
    sally_portrait: Sprite.portraitSprite("sally", sheets.portrait2),
    boblin_portrait: Sprite.portraitSprite("boblin", sheets.portrait3),
    gwim_portrait: Sprite.portraitSprite("gwim", sheets.portrait13),

    silverSword: Sprite.itemSpriteOneFrame("silverSword", { sheet: sheets.weapons, col: 1, row: 0 }),
    hammer: Sprite.itemSpriteOneFrame("hammer", { sheet: sheets.weapons, col: 14, row: 0 }),
    stick: Sprite.itemSpriteOneFrame("stick", { sheet: sheets.weapons, col: 3, row: 1 }),
}

export {
    spriteSheets,
    sprites,
}