import { Color } from "@/canvas/Color";
import { Direction } from "@/game-classes/Direction";
import { Level } from "@/game-classes/Level";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { Item } from "@/game-classes/Item";
import { TeleportReaction } from "@/game-classes/Reaction";
import { Door, InteractableWallFeature, WallSwitch } from "@/game-classes/WallFeature";

import { sprites as sharedSprites } from "@/instances/sprites";

import { lowWall, doorway } from "@/instances/wallShapes"
import * as globalFeatures from "@/travels-in-generica/features"
import { Actor } from "@/game-classes/Actor";

import { itemTypes } from "./itemTypes"
import { Controller } from "@/game-classes/Controller";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";
import { FloorFeature, Pit } from "@/game-classes/FloorFeature";
import { Monster } from "@/rpg-classes/Monster";
import { sprites } from "./sprites";
import { CharacterStats } from "@/rpg-classes/CharacterStats";
import { Behaviour } from "@/game-classes/Behaviour";
import * as monsterDecisionFunctions from "./monsterBehaviour";

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

const lever1 = new WallSwitch({ sprite: sharedSprites.leverSprite, })
const door1 = new Door({ sprite: sharedSprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const door2 = new Door({ sprite: sharedSprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })

const teleportToCorner = new TeleportReaction({ x: 0, y: 0, direction: Direction.south })
const button1 = new InteractableWallFeature({ sprite: sharedSprites.buttonSprite, reactions: [teleportToCorner] })

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
        new Wall({ x: 5, y: 3, place: Direction.south, patternSprite: sharedSprites.brickWall, shape: lowWall }),

        new Wall({ x: 9, y: 2, place: Direction.south, color: new Color(120, 40, 20), features: [globalFeatures.painting1] }),

        new Wall({ x: 1, y: 5, place: Direction.west, color: new Color(120, 40, 20), features: [lever1] }),
        new Wall({ x: 1, y: 5, place: Direction.south, color: new Color(120, 40, 20), shape: doorway, open: true, features: [door1] }),

        new Wall({ x: 9, y: 4, place: Direction.north, patternSprite: sharedSprites.brickWall }),
        new Wall({ x: 0, y: 0, place: Direction.west, patternSprite: sharedSprites.brickWall }),
        new Wall({ x: 0, y: 0, place: Direction.north, color: new Color(200, 100, 90, 1) }),
        new Wall({ x: 1, y: 0, place: Direction.north, color: new Color(20, 250, 190) }),
        new Wall({ x: 3, y: 0, place: Direction.north, patternSprite: sharedSprites.windowWall }),
        new Wall({ x: 5, y: 0, place: Direction.north, patternSprite: sharedSprites.windowWall }),
        new Wall({ x: 6, y: 0, place: Direction.north, patternSprite: sharedSprites.brickWall }),
        new Wall({ x: 9, y: 0, place: Direction.east, patternSprite: sharedSprites.brickWall, features: [globalFeatures.painting1] }),
        new Wall({ x: 10, y: 4, place: Direction.east, color: new Color(120, 40, 20), shape: doorway, open: true, features: [door2] }),
    ],
    squaresWithFeatures: [

        new SquareWithFeatures({ x: 8, y: 4, direction: Direction.north, floorFeatures: [blueSquare],  }),
        new SquareWithFeatures({ x: 7, y: 4, direction: Direction.north, floorFeatures: [redSquare],  }),
        new SquareWithFeatures({
            x: 4, y: 8, direction: Direction.north, floorFeatures: [
                new Pit({}),
            ]
        }),
        new SquareWithFeatures({
            x: 2, y: 8, direction: Direction.north, floorFeatures: [
                new Pit({ status: "CLOSED" }),
            ]
        }),

    ],
    actors: [
        new Actor({
            vantage: new Vantage({ x: 5.5, y: 3.5, direction: Direction.west }),
            sprite: sharedSprites.dinoSprite,
            height: .5, width: .5,
        }),

        new Monster({
            vantage: new Vantage({ x: 0.5, y: 2.5, direction: Direction.south }),
            sprite: sprites.skeletonArcher,
            defaultAttackAnimation: "ATTACK_SWING",
            stats: new CharacterStats([1, 10], [10, 10]),
            behaviour: new Behaviour(monsterDecisionFunctions.standAndFight),
        }),

        // new Monster({
        //     vantage: new Vantage({ x: 0.5, y: 6.5, direction: Direction.north }),
        //     sprite: sprites.skeletonSpearman,
        //     stats: new CharacterStats([10, 10], [10, 10]),
        //     behaviour: new Behaviour(monsterDecisionFunctions.attackOrMoveClockwise),
        // }),

        // new Monster({
        //     vantage: new Vantage({ x: 4.5, y: 6.5, direction: Direction.north }),
        //     sprite: sprites.skeletonSpearman,
        //     stats: new CharacterStats([10, 10], [10, 10]),
        //     behaviour: new Behaviour(monsterDecisionFunctions.attackOrMoveAntiClockwise),
        // }),

    ],
    items: [
        new Item({ type: itemTypes.apple, vantage: new Vantage({ x: 4.85, y: 4.4, direction: Direction.north }) }),
    ],
    controllers: [
        new Controller({
            inputs: [lever1], subject: door1, defaultSubjectState: "CLOSED", statusMap: [
                [["ON"], "OPEN"],
            ]
        }),
        new Controller({
            inputs: [blueSquare, redSquare], subject: door2, defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, statusMap: [
                [[FloorFeature.WEIGHED, FloorFeature.WEIGHED], "OPEN"],
            ]
        }),
    ]
}).withWallsAround()



export { level2 }