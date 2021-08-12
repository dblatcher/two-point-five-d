import { sprites, textBoards } from "@/instances/sprites";
import { InteractableWallFeature, WallFeature } from "@/game-classes/WallFeature";
import { makeTunnel } from "@/game-classes/Reaction";


const painting1 = new WallFeature({ sprite: sprites.paintingWall, })
const paintingClipped = new WallFeature({ sprite: sprites.paintingWall, clipToWall: true })

const poemBoard = new WallFeature({
    clipToWall: true,
    textBoard: textBoards.poem,
})

const advertBoard = new WallFeature({
    clipToWall: true,
    textBoard: textBoards.advert,
})

const tunnel = makeTunnel();

const staircaseA = {
    up: new InteractableWallFeature({ sprite: sprites.stairs, reactions: [tunnel[0]] }),
    down: new InteractableWallFeature({ sprite: sprites.stairs, reactions: [tunnel[1]] })
}


export {
    painting1, staircaseA, paintingClipped, poemBoard, advertBoard,
}