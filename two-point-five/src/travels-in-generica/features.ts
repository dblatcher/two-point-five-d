import { sprites, textBoards } from "@/instances/sprites";
import { sprites as mySprites } from "./sprites";
import { InteractableWallFeature, WallFeature } from "@/game-classes/WallFeature";
import { makeTunnel } from "@/game-classes/Reaction";
import { Color } from "@/canvas/Color";
import { CeilingFeature } from "@/game-classes/CeilingFeature";


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

const staircaseAUp = new InteractableWallFeature({ sprite: sprites.stairs, reactions: [tunnel[0]] })

const staircaseAdown =  new InteractableWallFeature({ sprite: sprites.stairs, reactions: [tunnel[1]] })


const brownCeiling = new CeilingFeature({ plotConfig: { fillStyle: 'saddlebrown', strokeStyle: 'sandybrown' } });
const grayCeiling = new CeilingFeature({ plotConfig: { fillStyle: 'gray', strokeStyle: 'gray' } });
const redCeiling = new CeilingFeature({ plotConfig: { fillStyle: Color.RED.css, strokeStyle: Color.YELLOW.css } });

const torch = new WallFeature({
    sprite: mySprites.torch,
})

export {
    painting1, staircaseAUp, staircaseAdown, paintingClipped, poemBoard, advertBoard, brownCeiling, grayCeiling, redCeiling,torch
}