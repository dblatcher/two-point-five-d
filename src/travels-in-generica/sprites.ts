import { Frame, Sprite, SpriteSheet } from "@/canvas/Sprite"


const spriteSheets: SpriteSheet[] = []

const sheets = {
    //https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
    skeleton_walk: new SpriteSheet("skeleton_walk", require("../assets/sprites/skeleton/walk.png"), spriteSheets, { pattern: "GRID", cols: 9, rows: 4 }),
    skeleton_slash: new SpriteSheet("skeleton_slash", require("../assets/sprites/skeleton/slash.png"), spriteSheets, { pattern: "GRID", cols: 6, rows: 4 }),
}

const skeletonSprite = new Sprite("SKELETON", {
    baseline: .25,
    shadow: { x: 1 / 8, y: 1 / 24 },
    size: { x: .5, y: .5 },
    transforms: ["RESIZE_CENTER", "CROP_BASE"],
    animations: new Map<string, Frame[]>()
        .set("STAND_FORWARD", [
            { sheet: sheets.skeleton_walk, col: 0, row: 0 },
        ])
        .set("STAND_LEFT", [
            { sheet: sheets.skeleton_walk, col: 0, row: 1 },
        ])
        .set("STAND_BACK", [
            { sheet: sheets.skeleton_walk, col: 0, row: 2 },
        ])
        .set("STAND_RIGHT", [
            { sheet: sheets.skeleton_walk, col: 0, row: 3 },
        ])
        .set("WALK_FORWARD", [
            { sheet: sheets.skeleton_walk, col: 0, row: 0 },
            { sheet: sheets.skeleton_walk, col: 1, row: 0 },
            { sheet: sheets.skeleton_walk, col: 2, row: 0 },
            { sheet: sheets.skeleton_walk, col: 3, row: 0 },
            { sheet: sheets.skeleton_walk, col: 4, row: 0 },
            { sheet: sheets.skeleton_walk, col: 5, row: 0 },
            { sheet: sheets.skeleton_walk, col: 6, row: 0 },
            { sheet: sheets.skeleton_walk, col: 7, row: 0 },
            { sheet: sheets.skeleton_walk, col: 8, row: 0 },
        ])
        .set("WALK_LEFT", [
            { sheet: sheets.skeleton_walk, col: 0, row: 1 },
            { sheet: sheets.skeleton_walk, col: 1, row: 1 },
            { sheet: sheets.skeleton_walk, col: 2, row: 1 },
            { sheet: sheets.skeleton_walk, col: 3, row: 1 },
            { sheet: sheets.skeleton_walk, col: 4, row: 1 },
            { sheet: sheets.skeleton_walk, col: 5, row: 1 },
            { sheet: sheets.skeleton_walk, col: 6, row: 1 },
            { sheet: sheets.skeleton_walk, col: 7, row: 1 },
            { sheet: sheets.skeleton_walk, col: 8, row: 1 },
        ])
        .set("WALK_BACK", [
            { sheet: sheets.skeleton_walk, col: 0, row: 2 },
            { sheet: sheets.skeleton_walk, col: 1, row: 2 },
            { sheet: sheets.skeleton_walk, col: 2, row: 2 },
            { sheet: sheets.skeleton_walk, col: 3, row: 2 },
            { sheet: sheets.skeleton_walk, col: 4, row: 2 },
            { sheet: sheets.skeleton_walk, col: 5, row: 2 },
            { sheet: sheets.skeleton_walk, col: 6, row: 2 },
            { sheet: sheets.skeleton_walk, col: 7, row: 2 },
            { sheet: sheets.skeleton_walk, col: 8, row: 2 },
        ])
        .set("WALK_RIGHT", [
            { sheet: sheets.skeleton_walk, col: 0, row: 3 },
            { sheet: sheets.skeleton_walk, col: 1, row: 3 },
            { sheet: sheets.skeleton_walk, col: 2, row: 3 },
            { sheet: sheets.skeleton_walk, col: 3, row: 3 },
            { sheet: sheets.skeleton_walk, col: 4, row: 3 },
            { sheet: sheets.skeleton_walk, col: 5, row: 3 },
            { sheet: sheets.skeleton_walk, col: 6, row: 3 },
            { sheet: sheets.skeleton_walk, col: 7, row: 3 },
            { sheet: sheets.skeleton_walk, col: 8, row: 3 },
        ])
        .set("ATTACK_FORWARD", [
            { sheet: sheets.skeleton_slash, col: 0, row: 0 },
            { sheet: sheets.skeleton_slash, col: 1, row: 0 },
            { sheet: sheets.skeleton_slash, col: 2, row: 0 },
            { sheet: sheets.skeleton_slash, col: 3, row: 0 },
            { sheet: sheets.skeleton_slash, col: 4, row: 0 },
            { sheet: sheets.skeleton_slash, col: 5, row: 0 },

        ])
        .set("ATTACK_LEFT", [
            { sheet: sheets.skeleton_slash, col: 0, row: 1 },
            { sheet: sheets.skeleton_slash, col: 1, row: 1 },
            { sheet: sheets.skeleton_slash, col: 2, row: 1 },
            { sheet: sheets.skeleton_slash, col: 3, row: 1 },
            { sheet: sheets.skeleton_slash, col: 4, row: 1 },
            { sheet: sheets.skeleton_slash, col: 5, row: 1 },

        ])
        .set("ATTACK_BACK", [
            { sheet: sheets.skeleton_slash, col: 0, row: 2 },
            { sheet: sheets.skeleton_slash, col: 1, row: 2 },
            { sheet: sheets.skeleton_slash, col: 2, row: 2 },
            { sheet: sheets.skeleton_slash, col: 3, row: 2 },
            { sheet: sheets.skeleton_slash, col: 4, row: 2 },
            { sheet: sheets.skeleton_slash, col: 5, row: 2 },

        ])
        .set("ATTACK_RIGHT", [
            { sheet: sheets.skeleton_slash, col: 0, row: 3 },
            { sheet: sheets.skeleton_slash, col: 1, row: 3 },
            { sheet: sheets.skeleton_slash, col: 2, row: 3 },
            { sheet: sheets.skeleton_slash, col: 3, row: 3 },
            { sheet: sheets.skeleton_slash, col: 4, row: 3 },
            { sheet: sheets.skeleton_slash, col: 5, row: 3 },
        ])
})

const sprites = {
    skeletonSprite
}

export {
    spriteSheets,
    sprites,
}