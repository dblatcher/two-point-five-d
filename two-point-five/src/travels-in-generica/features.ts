import { Color } from "@/canvas/Color";
import { CeilingFeature } from "@/game-classes/CeilingFeature";
import { makeTwoWayTunnel } from "@/game-classes/Reaction";
import { InteractableWallFeature, WallFeature } from "@/game-classes/WallFeature";
import { sprites, textBoards } from "@/instances/sprites";
import { sprites as mySprites } from "./sprites";


const painting1 = new WallFeature({ spriteId: sprites.paintingWall.id, })
const paintingClipped = new WallFeature({ spriteId: sprites.paintingWall.id, clipToWall: true })

const poemBoard = new WallFeature({
    clipToWall: true,
    textBoard: textBoards.poem,
})

const advertBoard = new WallFeature({
    clipToWall: true,
    textBoard: textBoards.advert,
})

const [toLevel1OnStaircaseA, toLevel2OnStaircaseA] = makeTwoWayTunnel('upstairs','downstairs');
const staircaseAUp = new InteractableWallFeature({ spriteId: sprites.stairs.id, reactions: [toLevel1OnStaircaseA] })
const staircaseAdown = new InteractableWallFeature({ spriteId: sprites.stairs.id, reactions: [toLevel2OnStaircaseA] })


const brownCeiling = new CeilingFeature({ plotConfig: { fillStyle: 'saddlebrown', strokeStyle: 'sandybrown' } });
const grayCeiling = new CeilingFeature({ plotConfig: { fillStyle: 'gray', strokeStyle: 'gray' } });
const redCeiling = new CeilingFeature({ plotConfig: { fillStyle: Color.RED.css, strokeStyle: Color.YELLOW.css } });

const torch = new WallFeature({
    spriteId: mySprites.torch.id,
})

export { advertBoard, brownCeiling, grayCeiling, painting1, paintingClipped, poemBoard, redCeiling, staircaseAdown, staircaseAUp, torch };
