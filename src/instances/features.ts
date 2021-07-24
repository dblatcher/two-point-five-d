import { sprites, textBoards } from "@/instances/sprites";
import { Door, InteractableWallFeature, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { Direction } from "@/game-classes/Direction";
import { TeleportReaction, makeTunnel } from "@/game-classes/Reaction";
import { itemTypes } from "@/instances/itemTypes";
import { FloorFeature } from "@/game-classes/FloorFeature";



const teleportToCorner = new TeleportReaction({ x: 0, y: 0, direction: Direction.south })

const lever1 = new WallSwitch({ sprite: sprites.leverSprite, })
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

const door1 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const door2 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })

const button1 = new InteractableWallFeature({ sprite: sprites.buttonSprite, reactions: [teleportToCorner] })
const keyhole = new InteractableWallFeature({ sprite: sprites.keyHole, requiresItem: itemTypes.key, consumesItem: false, onBothSides: true })

const tunnel = makeTunnel();
const stairs = new InteractableWallFeature({ sprite: sprites.stairs, reactions: [tunnel[0]] })
const stairs2 = new InteractableWallFeature({ sprite: sprites.stairs, reactions: [tunnel[1]] })


const bigSquareOnFloor: [number, number][] = [
    [-.45, -.45], [.45, -.45], [.45, .45], [-.45, .45]
]


const blueSquare = new FloorFeature({
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'blue' }, shape: bigSquareOnFloor
})

const redSquare = new FloorFeature({
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'red' }, shape: bigSquareOnFloor
})

export {
    lever1, painting1, door1, button1, keyhole, stairs, stairs2, paintingClipped, poemBoard, advertBoard, blueSquare, door2, redSquare
}