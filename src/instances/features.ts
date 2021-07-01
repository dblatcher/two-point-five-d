import { sprites } from "@/instances/sprites";
import { Door, InteractableWallFeature, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { Direction } from "@/game-classes/Direction";
import { TeleportReaction } from "@/game-classes/Reaction";
import { Sprite } from "@/game-classes/Sprite";
import { Trigger } from "@/game-classes/Trigger";

const leverOpensDoor = new Trigger({
    targetId: "door1", statusPairs: [
        ["ON", "OPEN"],
        ["OFF", "CLOSED"],
    ]
});

const buttonOpensDoor = new Trigger({
    targetId: "door1", toggle: ['OPEN', 'CLOSED']
});

const telportToCorner = new TeleportReaction({ x: 0, y: 0, direction: Direction.south })

const lever1 = new WallSwitch({ sprite: sprites.leverSprite, animation: "OFF", triggers: [leverOpensDoor] })
const painting1 = new WallFeature({ sprite: sprites.paintingWall, animation: Sprite.defaultWallAnimation })
const door1 = new Door({ sprite: sprites.doorSprite, animation: 'OPEN', canOpenDirectly: false, id: "door1" })

const button1 = new InteractableWallFeature({ sprite: sprites.buttonSprite, animation: Sprite.defaultWallAnimation, reactions: [telportToCorner] })
const button2 = new InteractableWallFeature({ sprite: sprites.smallButtonSprite, animation: Sprite.defaultWallAnimation, triggers: [buttonOpensDoor] })


export {
    lever1, painting1,door1,button1,button2
}