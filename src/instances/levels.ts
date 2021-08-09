import { Behaviour, decisionFunctions } from "@/game-classes/Behaviour";
import { Color } from "@/canvas/Color";
import { Direction } from "@/game-classes/Direction";
import { Figure } from "@/game-classes/Figure";
import { Level } from "@/game-classes/Level";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { Item } from "@/game-classes/Item";
import { PlayerVantage } from "@/game-classes/PlayerVantage";

import { sprites } from "@/instances/sprites";
import { itemTypes } from "@/instances/itemTypes"
import { lever1, painting1, door1, button1, keyhole, stairs, stairs2, paintingClipped, poemBoard, advertBoard, blueSquare, door2, redSquare } from "@/instances/features"
import { lowWall, doorway, spikey } from "@/instances/wallShapes"
import { FloorFeature, Pit } from "@/game-classes/FloorFeature";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";
import { Controller } from "@/game-classes/Controller";


const busyLevel: Level = new Level({
    height: 8, width: 15,
    defaultWallPattern: undefined,
    floorColor: new Color(190, 120, 80),
    walls: [
        new Wall({ x: 1, y: 2, place: Direction.east, features: [button1] }),
        new Wall({ x: 1, y: 3, place: Direction.west, features: [stairs2] }),

        new Wall({ x: 3, y: 4, place: Direction.east, shape: doorway, open: true }),
        new Wall({ x: 3, y: 2, place: Direction.east, shape: lowWall }),
        new Wall({ x: 4, y: 3, place: Direction.south, shape: lowWall }),
        new Wall({ x: 5, y: 0, place: Direction.east, shape: lowWall }),
        new Wall({ x: 5, y: 3, place: Direction.south, patternSprite: sprites.brickWall, shape: lowWall }),

        new Wall({ x: 9, y: 2, place: Direction.south, color: new Color(120, 40, 20), features: [painting1] }),
        //new Wall({ x: 9, y: 3, place: Direction.north, color:new Color(120,140,20)  }),


        // new Wall({ x: 9, y: 3, place: Direction.south, patternSprite: sprites.windowWall }),
        new Wall({ x: 9, y: 4, place: Direction.north, patternSprite: sprites.brickWall }),

        new Wall({ x: 0, y: 0, place: Direction.west, patternSprite: sprites.brickWall }),
        new Wall({ x: 0, y: 0, place: Direction.north, color: new Color(200, 100, 90, 1) }),
        new Wall({ x: 1, y: 0, place: Direction.north, color: new Color(20, 250, 190) }),
        new Wall({ x: 3, y: 0, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 5, y: 0, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 6, y: 0, place: Direction.north, patternSprite: sprites.brickWall }),
        new Wall({ x: 9, y: 0, place: Direction.east, patternSprite: sprites.brickWall, features: [painting1] }),
    ],
    contents: [
        new Figure({ x: 5.5, y: 3.5, direction: Direction.west, sprite: sprites.dinoSprite, height: .5, width: .5, initialAnimation: "WALK", behaviour: new Behaviour(decisionFunctions.moveAntiClockwise) }),
    ],
    items: [
        new Item({ type: itemTypes.apple, vantage: new Vantage({ x: 4.85, y: 4.4, direction: Direction.north }) }),
    ]
}).withWallsAround()

const simpleLevel: Level = new Level({
    height: 10, width: 15,
    walls: [
        new Wall({ x: 8, y: 2, place: Direction.south, color: new Color(200, 255, 0), shape: doorway, features: [door1, keyhole], open: true }),
        new Wall({ x: 7, y: 2, place: Direction.south, color: new Color(200, 255, 0), features: [lever1] }),

        new Wall({ x: 2, y: 2, place: Direction.north, color: new Color(120, 40, 20), features: [paintingClipped], shape: spikey, patternSprite: sprites.brickWall2, }),
        new Wall({ x: 9, y: 2, place: Direction.east, color: new Color(120, 40, 20), features: [painting1] }),
        new Wall({ x: 9, y: 3, place: Direction.east, color: new Color(120, 40, 20), features: [stairs] }),

        new Wall({ x: 10, y: 4, place: Direction.east, color: new Color(120, 40, 20), shape: doorway, open: true, features: [door2] }),

    ],
    contents: [
        new SquareWithFeatures({ x: 8, y: 4, direction: Direction.north, floorFeatures: [blueSquare] }),
        new SquareWithFeatures({ x: 7, y: 4, direction: Direction.north, floorFeatures: [redSquare] }),

        new SquareWithFeatures({
            x: 2, y: 4, direction: Direction.north, floorFeatures: [
                new Pit({}),
            ]
        }),
        new SquareWithFeatures({
            x: 2, y: 3, direction: Direction.north, floorFeatures: [
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
    ]
})


const playerVantage = new PlayerVantage({
    x: 1, y: 5, direction: Direction.north,
});

const controllers: Controller[] = [

    new Controller({
        inputs: [blueSquare, redSquare], subject: door2, defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, statusMap: [
            [[FloorFeature.WEIGHED, FloorFeature.WEIGHED], "OPEN"],
        ]
    }),
    new Controller({ inputs: [keyhole], subject: door1, statusChangeOnInputTrigger: "OPEN" }),

]

export { simpleLevel as level1, busyLevel as level2, playerVantage, controllers }