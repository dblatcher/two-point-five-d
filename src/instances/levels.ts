import { Behaviour, decisionFunctions } from "@/game-classes/Behaviour";
import { Color } from "@/game-classes/Color";
import { Direction } from "@/game-classes/Direction";
import { Figure } from "@/game-classes/Figure";
import { Level } from "@/game-classes/Level";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { Item } from "@/game-classes/Item";
import { Character } from "@/game-classes/Character";

import { duck } from "@/instances/figureFactory";
import { sprites } from "@/instances/sprites";
import { itemTypes } from "@/instances/itemTypes"
import { lever1, painting1, door1, button1, keyhole, pitShape, stairs, stairs2 } from "@/instances/features"
import { lowWall, doorway } from "@/instances/wallShapes"
import { FloorFeature, Pit } from "@/game-classes/FloorFeature";



const busyLevel: Level = new Level({
    height: 8, width: 15,
    defaultWallPattern: undefined,
    floorColor: new Color(190, 120, 80),
    walls: [
        new Wall({ x: 1, y: 2, place: Direction.east, features: [button1] }),
        new Wall({ x: 1, y: 3, place: Direction.west, features: [stairs2] }),
        new Wall({ x: 3, y: 3, place: Direction.east, shape: doorway, features: [door1, keyhole], open: true }),
        new Wall({ x: 1, y: 1, place: Direction.east, color: new Color(200, 255, 0), patternSprite: sprites.brickWall, features: [lever1] }),
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
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: new Behaviour(decisionFunctions.moveClockwise) }),
        duck({ x: 4.25, y: 5.25, direction: Direction.north, behaviour: new Behaviour(decisionFunctions.wanderForward) }),
        duck({ x: 9.9, y: 3.25, direction: Direction.west, behaviour: undefined }),
        // duck({ x: 9.9, y: 2.75, direction: Direction.west, behaviour: undefined }),
        // duck({ x: 9.9, y: 3.25, direction: Direction.west, behaviour: undefined }),
        new Figure({ x: 5.5, y: 3.5, direction: Direction.west, sprite: sprites.dinoSprite, height: .5, width: .5, initialAnimation: "WALK", behaviour: new Behaviour(decisionFunctions.moveAntiClockwise) }),

        new FloorFeature({ x: 9, y: 4, direction: Direction.east, blocksByDefault: true, plotConfig: { noFill: false, fillStyle: 'blue' }, shape: pitShape }),
        new Pit({ x: 10, y: 4, direction: Direction.east, plotConfig: { noFill: false, fillStyle: 'blue' }, shape: pitShape }),
    ],
    items: [
        new Item({ type: itemTypes.apple, vantage: new Vantage({ x: 4.85, y: 4.4, direction: Direction.north }) }),
    ]
}).withWallsAround()

const simpleLevel: Level = new Level({
    height: 10, width: 15,
    defaultWallPattern: sprites.brickWall,
    walls: [
        new Wall({ x: 9, y: 2, place: Direction.west, color: new Color(120, 40, 20), features: [painting1] }),
        new Wall({ x: 9, y: 2, place: Direction.east, color: new Color(120, 40, 20), features: [painting1] }),
        new Wall({ x: 9, y: 3, place: Direction.east, color: new Color(120, 40, 20), features: [stairs] }),

    ],
    contents: [
        duck({ x: 9.2, y: 2.2, direction: Direction.west, behaviour: undefined }),
        new FloorFeature({ x: 9, y: 3, direction: Direction.east })
    ],
    items: [

    ]
})

const playerCharacter = new Character({
    x: 4, y: 3, direction: Direction.east, inventory: [
        new Item({ type: itemTypes.key, }),
        null,
        new Item({ type: itemTypes.bean }),
        null,
        null,
        null,
        null,
        null,
    ]
});



export { simpleLevel as level1, busyLevel as level2, playerCharacter }