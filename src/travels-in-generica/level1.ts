import { Color } from "@/canvas/Color";
import { Direction } from "@/game-classes/Direction";
import { Level } from "@/game-classes/Level";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { Item } from "@/game-classes/Item";
import { FloorFeature, Pit } from "@/game-classes/FloorFeature";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";
import { Controller } from "@/game-classes/Controller";
import { Door, InteractableWallFeature, WallSwitch } from "@/game-classes/WallFeature";


import { doorway, spikey, tower } from "@/instances/wallShapes"
import { sprites } from "@/instances/sprites";
import { itemTypes } from "@/instances/itemTypes"
import * as globalFeatures from "@/travels-in-generica/features"
import { Figure } from "@/game-classes/Figure";


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

const door1 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const door2 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const door3 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const lever1 = new WallSwitch({ sprite: sprites.leverSprite, })
const keyhole = new InteractableWallFeature({ sprite: sprites.keyHole, requiresItem: itemTypes.key, consumesItem: false, onBothSides: true })

const level1: Level = new Level({
    height: 10, width: 15,
    startingVantage: { x: 4, y: 4, direction: Direction.south },
    walls: [
        new Wall({ x: 8, y: 2, place: Direction.south, color: new Color(200, 255, 0), shape: doorway, features: [door3, keyhole], open: true }),
        new Wall({ x: 7, y: 2, place: Direction.south, color: new Color(200, 255, 0) }),

        new Wall({ x: 2, y: 2, place: Direction.north, color: new Color(120, 40, 20), features: [globalFeatures.poemBoard], shape: tower, patternSprite: sprites.brickWall2, }),
        new Wall({ x: 3, y: 2, place: Direction.north, color: new Color(120, 40, 20), features: [globalFeatures.paintingClipped], shape: spikey, patternSprite: sprites.brickWall2, }),
        new Wall({ x: 2, y: 1, place: Direction.west, color: new Color(120, 40, 20), shape: tower, patternSprite: sprites.brickWall2, }),
        new Wall({ x: 2, y: 1, place: Direction.east, color: new Color(120, 40, 20), shape: tower, patternSprite: sprites.brickWall2, }),
        new Wall({ x: 2, y: 1, place: Direction.north, color: new Color(120, 40, 20), shape: tower, patternSprite: sprites.brickWall2, }),
        new Wall({ x: 9, y: 2, place: Direction.east, color: new Color(120, 40, 20), features: [globalFeatures.painting1] }),
        new Wall({ x: 9, y: 3, place: Direction.east, color: new Color(120, 40, 20), features: [globalFeatures.staircaseA.down] }),

        new Wall({ x: 10, y: 4, place: Direction.east, color: new Color(120, 40, 20), shape: doorway, open: true, features: [door2] }),

        new Wall({ x: 1, y: 5, place: Direction.south, color: new Color(120, 40, 20), shape: doorway, open: true, features: [door1] }),
        new Wall({ x: 2, y: 4, place: Direction.south, color: new Color(120, 40, 20), features: [lever1] }),

    ],
    contents: [
        new SquareWithFeatures({ x: 8, y: 4, direction: Direction.north, floorFeatures: [blueSquare] }),
        new SquareWithFeatures({ x: 7, y: 4, direction: Direction.north, floorFeatures: [redSquare] }),

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

        new Figure({
            x:4.75, y:5.75, direction:Direction.north, sprite:sprites.skeletonSprite,
            initialAnimation: "ATTACK",
        }),
        new Figure({
            x:4.25, y:5.25, direction:Direction.north, sprite:sprites.skeletonSprite,
            initialAnimation: "STAND",
        }),
    ],
    items: [
        new Item({
            type: itemTypes.bardHat, vantage: new Vantage({ x: 8.2, y: 6.2, direction: Direction.north })
        }),
        new Item({
            type: itemTypes.helmet, vantage: new Vantage({ x: 5.5, y: 4.5, direction: Direction.north })
        }),
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
        new Controller({ inputs: [keyhole], subject: door3, statusChangeOnInputTrigger: "OPEN" }),
    ]
})



export { level1 }