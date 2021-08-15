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

    //https://opengameart.org/content/39-portraits-pixel-art-pack
    portrait1: new SpriteSheet("portrait1", require("../assets/sprites/portraits/Icons_01.png"), spriteSheets),
    portrait2: new SpriteSheet("portrait2", require("../assets/sprites/portraits/Icons_02.png"), spriteSheets),
    portrait3: new SpriteSheet("portrait3", require("../assets/sprites/portraits/Icons_03.png"), spriteSheets),
    portrait13: new SpriteSheet("portrait15", require("../assets/sprites/portraits/Icons_13.png"), spriteSheets),
    portrait15: new SpriteSheet("portrait15", require("../assets/sprites/portraits/Icons_15.png"), spriteSheets),
}

function makeLpcSprite(name:string, walkSheet:SpriteSheet, slashSheet:SpriteSheet):Sprite {

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


const sprites = {
    skeletonSprite: makeLpcSprite("SKELETON", sheets.skeleton_walk,sheets.skeleton_slash),
    farmerSprite: makeLpcSprite("FARMER", sheets.farmer_walk,sheets.farmer_slash),
    guardSprite: makeLpcSprite("GUARD", sheets.guard_walk,sheets.guard_slash),
    fighterSprite: makeLpcSprite("FIGHTER", sheets.fighter_walk,sheets.fighter_slash),

    drake_portrait: Sprite.portraitSprite("drake", sheets.portrait1),
    sally_portrait: Sprite.portraitSprite("sally", sheets.portrait2),
    boblin_portrait: Sprite.portraitSprite("boblin", sheets.portrait3),
    gwim_portrait: Sprite.portraitSprite("gwim", sheets.portrait13),
}

export {
    spriteSheets,
    sprites,
}