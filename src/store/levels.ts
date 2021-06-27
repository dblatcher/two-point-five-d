import { Point } from "@/canvas/canvas-utility";
import { Behaviour, decisionFunctions } from "@/game-classes/Behaviour";
import { Color } from "@/game-classes/Color";
import { Direction } from "@/game-classes/Direction";
import { duck } from "../game-classes/Duck";
import { Figure } from "@/game-classes/Figure";
import { Level } from "@/game-classes/Level";
import { Position } from "@/game-classes/Position";
import { TeleportReaction } from "@/game-classes/Reaction";
import { Sprite } from "@/game-classes/Sprite";
import { Trigger } from "@/game-classes/Trigger";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { Door, InteractableWallFeature, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { sprites } from "./sprites";
import { Item } from "@/game-classes/Item";


const lowWall: Point[] = [
    { x: 0, y: 0 },
    { x: 0, y: .5 },
    { x: .25, y: .5 },
    { x: .35, y: .5 },
    { x: .35, y: .25 },
    { x: .65, y: .25 },
    { x: .65, y: .5 },
    { x: .75, y: .5 },
    { x: 1, y: .5 },
    { x: 1, y: 0 },
]

const doorway: Point[] = [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: .9, y: 0 },
    { x: .9, y: .9 },
    { x: .1, y: .9 },
    { x: .1, y: .0 },
    { x: 0, y: .0 },
]

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



const busyLevel: Level = new Level({
    height: 8, width: 15,
    defaultWallPattern: undefined,
    walls: [
        new Wall({ x: 1, y: 2, place: Direction.east, features: [button1] }),
        new Wall({ x: 3, y: 3, place: Direction.east, shape: doorway, features: [door1, button2], open: true }),
        new Wall({ x: 1, y: 1, place: Direction.east, color: new Color(200, 255, 0), patternSprite: sprites.brickWall, features: [lever1] }),
        new Wall({ x: 3, y: 4, place: Direction.east, shape: doorway, open: true }),
        new Wall({ x: 3, y: 2, place: Direction.east, shape: lowWall }),
        new Wall({ x: 4, y: 3, place: Direction.south, shape: lowWall }),
        new Wall({ x: 5, y: 0, place: Direction.east, shape: lowWall }),
        new Wall({ x: 5, y: 3, place: Direction.south, patternSprite: sprites.brickWall, shape: lowWall }),

        new Wall({ x: 9, y: 2, place: Direction.south, color: new Color(120, 40, 20) }),
        //new Wall({ x: 9, y: 3, place: Direction.north, color:new Color(120,140,20)  }),


        // new Wall({ x: 9, y: 3, place: Direction.south, patternSprite: sprites.windowWall }),
        new Wall({ x: 9, y: 4, place: Direction.north, patternSprite: sprites.brickWall }),

        new Wall({ x: 0, y: 0, place: Direction.west, patternSprite: sprites.brickWall }),
        new Wall({ x: 0, y: 0, place: Direction.north, color: new Color(200, 100, 90, 1) }),
        new Wall({ x: 1, y: 0, place: Direction.north, color: new Color(20, 250, 190) }),
        new Wall({ x: 2, y: 0, place: Direction.north }),
        new Wall({ x: 3, y: 0, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 4, y: 0, place: Direction.north }),
        new Wall({ x: 5, y: 0, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 6, y: 0, place: Direction.north, patternSprite: sprites.brickWall }),
        new Wall({ x: 7, y: 0, place: Direction.north }),
        new Wall({ x: 8, y: 0, place: Direction.north }),
        new Wall({ x: 9, y: 0, place: Direction.north }),
        new Wall({ x: 9, y: 0, place: Direction.east, patternSprite: sprites.brickWall, features: [painting1] }),
    ],
    contents: [
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: new Behaviour(decisionFunctions.moveClockwise) }),
        duck({ x: 4.25, y: 5.25, direction: Direction.north, behaviour: new Behaviour(decisionFunctions.wanderForward) }),
        duck({ x: 9.9, y: 3.25, direction: Direction.west, behaviour: undefined }),
        // duck({ x: 9.9, y: 2.75, direction: Direction.west, behaviour: undefined }),
        // duck({ x: 9.9, y: 3.25, direction: Direction.west, behaviour: undefined }),
        new Figure({ x: 5.5, y: 3.5, direction: Direction.west, sprite: sprites.dinoSprite, height: .5, width: .5, initialAnimation: "WALK", behaviour: new Behaviour(decisionFunctions.moveAntiClockwise) }),

        new Position({ x: 1, y: 3 }),
        new Position({ x: 3.25, y: 3.4 }),
    ],
    items:[]
})

const simpleLevel: Level = new Level({
    height: 10, width: 10,
    defaultWallPattern: undefined,
    walls: [
        new Wall({ x: 3, y: 4, place: Direction.east }),
        new Wall({ x: 3, y: 4, place: Direction.south }),
        new Wall({ x: 4, y: 5, place: Direction.west }),
        // new Wall({ x: 4, y: 4, place: Direction.south, shape:lowWall }),
        // new Wall({ x: 4, y: 5, place: Direction.north, shape:lowWall }),
    ],
    contents: [
        duck({ x: 3.5, y: 4.5, direction: Direction.east }),
        // duck({ x: 4.5, y: 1.9, direction: Direction.east }),
        // duck({ x: 4.1, y: 7.9, direction: Direction.east }),
    ],
    items: [
        new Item({ sprite: sprites.apple, figureDimensions:{height:.2,width:.2}, vantage: new Vantage({ x: 4.85, y: 4.4, direction: Direction.north }) }),
        new Item({ sprite: sprites.bean, figureDimensions:{height:.2,width:.2}, vantage: new Vantage({ x: 3.25, y: 4.8, direction: Direction.north }) })
    ]
})

const playerVantage = new Vantage({ x: 5, y: 4  , direction: Direction.west });



export { simpleLevel as level, playerVantage }