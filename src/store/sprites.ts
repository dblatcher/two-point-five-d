import { Sprite, SpriteSheet } from "@/game-classes/Sprite"


const spriteSheets: SpriteSheet[] = []
//https://opengameart.org/content/cute-duck-animated-set
const duck_front = new SpriteSheet("duck-front", require("../assets/sprites/duck-front.png"), spriteSheets)
const duck_side = new SpriteSheet("duck-side", require("../assets/sprites/duck-side.png"), spriteSheets)
const duck_back = new SpriteSheet("duck-back", require("../assets/sprites/duck-back.png"), spriteSheets)


const duckSprite = new Sprite("DUCK", [
    { key: "BACK", sheet: duck_front },
    { key: "LEFT", sheet: duck_side },
    { key: "RIGHT", sheet: duck_side, transforms:["FLIP_H"] },
    { key: "FORWARD", sheet: duck_back },
])


export { duckSprite, spriteSheets }