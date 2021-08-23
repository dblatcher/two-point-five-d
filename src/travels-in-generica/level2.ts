import { Behaviour, decisionFunctions } from "@/game-classes/Behaviour";
import { Color } from "@/canvas/Color";
import { Direction } from "@/game-classes/Direction";
import { Figure } from "@/game-classes/Figure";
import { Level } from "@/game-classes/Level";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { Item } from "@/game-classes/Item";
import { TeleportReaction } from "@/game-classes/Reaction";
import { InteractableWallFeature } from "@/game-classes/WallFeature";

import { sprites } from "@/instances/sprites";
import { lowWall, doorway } from "@/instances/wallShapes"
import * as globalFeatures from "@/travels-in-generica/features"
import { Actor } from "@/game-classes/Actor";

import { itemTypes } from "./itemTypes"

const teleportToCorner = new TeleportReaction({ x: 0, y: 0, direction: Direction.south })
const button1 = new InteractableWallFeature({ sprite: sprites.buttonSprite, reactions: [teleportToCorner] })

const level2: Level = new Level({
    height: 8, width: 15,
    defaultWallPattern: undefined,
    floorColor: new Color(190, 120, 80),
    walls: [
        new Wall({ x: 1, y: 2, place: Direction.east, features: [button1] }),
        new Wall({ x: 1, y: 3, place: Direction.west, features: [globalFeatures.staircaseA.up] }),

        new Wall({ x: 3, y: 4, place: Direction.east, shape: doorway, open: true }),
        new Wall({ x: 3, y: 2, place: Direction.east, shape: lowWall }),
        new Wall({ x: 4, y: 3, place: Direction.south, shape: lowWall }),
        new Wall({ x: 5, y: 0, place: Direction.east, shape: lowWall }),
        new Wall({ x: 5, y: 3, place: Direction.south, patternSprite: sprites.brickWall, shape: lowWall }),

        new Wall({ x: 9, y: 2, place: Direction.south, color: new Color(120, 40, 20), features: [globalFeatures.painting1] }),
        //new Wall({ x: 9, y: 3, place: Direction.north, color:new Color(120,140,20)  }),


        // new Wall({ x: 9, y: 3, place: Direction.south, patternSprite: sprites.windowWall }),
        new Wall({ x: 9, y: 4, place: Direction.north, patternSprite: sprites.brickWall }),

        new Wall({ x: 0, y: 0, place: Direction.west, patternSprite: sprites.brickWall }),
        new Wall({ x: 0, y: 0, place: Direction.north, color: new Color(200, 100, 90, 1) }),
        new Wall({ x: 1, y: 0, place: Direction.north, color: new Color(20, 250, 190) }),
        new Wall({ x: 3, y: 0, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 5, y: 0, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 6, y: 0, place: Direction.north, patternSprite: sprites.brickWall }),
        new Wall({ x: 9, y: 0, place: Direction.east, patternSprite: sprites.brickWall, features: [globalFeatures.painting1] }),
    ],
    squaresWithFeatures: [
    ],
    actors: [
        new Actor({
            vantage: new Vantage({ x: 5.5, y: 3.5, direction: Direction.west }),
            sprite: sprites.dinoSprite,
            height: .5, width: .5,
        })

    ],
    items: [
        new Item({ type: itemTypes.apple, vantage: new Vantage({ x: 4.85, y: 4.4, direction: Direction.north }) }),
    ]
}).withWallsAround()



export { level2 }