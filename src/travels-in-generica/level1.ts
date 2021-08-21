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
import { sprites as sharedSprites } from "@/instances/sprites";
import { itemTypes } from "@/instances/itemTypes"
import * as globalFeatures from "@/travels-in-generica/features"
import { sprites } from "./sprites";
import { Behaviour, decisionFunctions } from "@/game-classes/Behaviour";
import { Actor } from "@/game-classes/Actor";
import { NonPlayerCharacter } from "@/rpg-classes/NonPlayerCharacter";
import { Sky } from "@/game-classes/Sky";
import { CeilingFeature } from "@/game-classes/CeilingFeature";


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

const redCeiling = new CeilingFeature({ plotConfig: { fillStyle: Color.RED.css, strokeStyle:Color.YELLOW.css } });

const door1 = new Door({ sprite: sharedSprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const door2 = new Door({ sprite: sharedSprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const door3 = new Door({ sprite: sharedSprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const lever1 = new WallSwitch({ sprite: sharedSprites.leverSprite, })
const keyhole = new InteractableWallFeature({ sprite: sharedSprites.keyHole, requiresItem: itemTypes.key, consumesItem: false, onBothSides: true })

const level1: Level = new Level({
    height: 10, width: 15,
    startingVantage: { x: 6, y: 5, direction: Direction.east },

    sky: new Sky({
        skyBaseColor: new Color(140, 150, 250),
        sun: true,
    }),

    walls: [
        new Wall({ x: 8, y: 2, place: Direction.south, color: new Color(200, 255, 0), shape: doorway, features: [door3, keyhole], open: true }),
        new Wall({ x: 7, y: 2, place: Direction.south, color: new Color(200, 255, 0) }),

        new Wall({ x: 2, y: 2, place: Direction.north, color: new Color(120, 40, 20), features: [globalFeatures.poemBoard], shape: tower, patternSprite: sharedSprites.brickWall2, }),
        new Wall({ x: 3, y: 2, place: Direction.north, color: new Color(120, 40, 20), features: [globalFeatures.paintingClipped], shape: spikey, patternSprite: sharedSprites.brickWall2, }),
        new Wall({ x: 2, y: 1, place: Direction.west, color: new Color(120, 40, 20), shape: tower, patternSprite: sharedSprites.brickWall2, }),
        new Wall({ x: 2, y: 1, place: Direction.east, color: new Color(120, 40, 20), shape: tower, patternSprite: sharedSprites.brickWall2, }),
        new Wall({ x: 2, y: 1, place: Direction.north, color: new Color(120, 40, 20), shape: tower, patternSprite: sharedSprites.brickWall2, }),
        new Wall({ x: 9, y: 2, place: Direction.east, color: new Color(120, 40, 20), features: [globalFeatures.painting1] }),
        new Wall({ x: 9, y: 3, place: Direction.east, color: new Color(120, 40, 20), features: [globalFeatures.staircaseA.down] }),

        new Wall({ x: 10, y: 4, place: Direction.east, color: new Color(120, 40, 20), shape: doorway, open: true, features: [door2] }),

        new Wall({ x: 1, y: 5, place: Direction.south, color: new Color(120, 40, 20), shape: doorway, open: true, features: [door1] }),
        new Wall({ x: 2, y: 4, place: Direction.south, color: new Color(120, 40, 20), features: [lever1] }),
        new Wall({ x: 8, y: 6, place: Direction.south }),

    ],
    squaresWithFeatures: [
        new SquareWithFeatures({ x: 8, y: 4, direction: Direction.north, floorFeatures: [blueSquare], ceilingFeatures: [redCeiling] }),
        new SquareWithFeatures({ x: 7, y: 4, direction: Direction.north, floorFeatures: [redSquare], ceilingFeatures: [redCeiling] }),
        new SquareWithFeatures({ x: 8, y: 3, direction: Direction.north, floorFeatures: [], ceilingFeatures: [redCeiling] }),
        new SquareWithFeatures({ x: 7, y: 3, direction: Direction.north, floorFeatures: [], ceilingFeatures: [redCeiling] }),
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
    items: [
        new Item({
            type: itemTypes.bardHat, vantage: new Vantage({ x: 8.2, y: 6.2, direction: Direction.north })
        }),
        new Item({
            type: itemTypes.helmet, vantage: new Vantage({ x: 5.5, y: 4.5, direction: Direction.north })
        }),
    ],

    actors: [
        new Actor({
            sprite: sprites.skeletonSprite,
            behaviour: new Behaviour(decisionFunctions.moveAntiClockwise),
            vantage: new Vantage({ x: 7.2, y: 6.2, direction: Direction.north })
        }),

        new NonPlayerCharacter({
            sprite: sprites.farmerSprite,
            // behaviour:new Behaviour(decisionFunctions.moveBackAndForward),
            vantage: new Vantage({ x: 8.25, y: 4.25, direction: Direction.north }),
            talkMessage: "I am taking my turnips to the market.",
            name: "John the farmer",
        }),

        new NonPlayerCharacter({
            sprite: sprites.fighterSprite,
            vantage: new Vantage({ x: 4.75, y: 5.75, direction: Direction.north }),
            talkMessage: "They aren't offering enough money for me to fight any monsters.",
            name: "Harry Longblade",
        }),

        new NonPlayerCharacter({
            sprite: sprites.guardSprite,
            vantage: new Vantage({ x: 4.25, y: 5.25, direction: Direction.north }),
            talkMessage: "Abide by the laws and we won't have any trouble.",
            name: "Corporal Mack",
        }),

        new NonPlayerCharacter({
            sprite: sprites.guardSprite,
            vantage: new Vantage({ x: 3.5, y: 2.5, direction: Direction.north }),
            talkMessage: "I'm just a guard.",
            name: "Corporal Colin",
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