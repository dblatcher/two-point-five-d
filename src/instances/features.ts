import { sprites } from "@/instances/sprites";
import { Door, InteractableWallFeature, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { Direction } from "@/game-classes/Direction";
import { TeleportReaction, makeTunnel } from "@/game-classes/Reaction";
import { Sprite } from "@/game-classes/Sprite";
import { Trigger } from "@/game-classes/Trigger";
import { itemTypes } from "@/instances/itemTypes";

const leverOpensDoor = new Trigger({
    targetId: "door1", statusPairs: [
        ["ON", "OPEN"],
        ["OFF", "CLOSED"],
    ]
});

const buttonOpensDoor = new Trigger({
    targetId: "door1", toggle: ['OPEN', 'CLOSED'], requiresItem: itemTypes.key, consumesItem: false
});

const teleportToCorner = new TeleportReaction({ x: 0, y: 0, direction: Direction.south })

const lever1 = new WallSwitch({ sprite: sprites.leverSprite, animation: "OFF", triggers: [leverOpensDoor] })
const painting1 = new WallFeature({ sprite: sprites.paintingWall, animation: Sprite.defaultWallAnimation })
const paintingClipped = new WallFeature({ sprite: sprites.paintingWall, animation: Sprite.defaultWallAnimation, clipToWall: true })
const door1 = new Door({ sprite: sprites.doorSprite, animation: 'OPEN', canOpenDirectly: false, id: "door1" })

const button1 = new InteractableWallFeature({ sprite: sprites.buttonSprite, animation: Sprite.defaultWallAnimation, reactions: [teleportToCorner] })
const keyhole = new InteractableWallFeature({ sprite: sprites.keyHole, animation: Sprite.defaultWallAnimation, triggers: [buttonOpensDoor], onBothSides: true })

const tunnel = makeTunnel();
const stairs = new InteractableWallFeature({ sprite: sprites.stairs, animation: Sprite.defaultWallAnimation, reactions: [tunnel[0]] })
const stairs2 = new InteractableWallFeature({ sprite: sprites.stairs, animation: Sprite.defaultWallAnimation, reactions: [tunnel[1]] })


const pitShape: [number, number][] = [
    [-.45, -.45], [.45, -.45], [.45, .45], [-.45, .45]
]

export {
    lever1, painting1, door1, button1, keyhole, pitShape, stairs, stairs2, paintingClipped
}