import { Point } from "@/canvas/canvas-utility";
import { Behaviour, decisionFunctions } from "@/game-classes/Behaviour";
import { Color } from "@/game-classes/Color";
import { Direction } from "@/game-classes/Direction";
import { duck } from "@/game-classes/duck";
import { Figure } from "@/game-classes/Figure";
import { Level } from "@/game-classes/Level";
import { Position } from "@/game-classes/Position";
import { Sprite } from "@/game-classes/Sprite";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { Door, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { brickWall, dinoSprite, doorSprite, leverSprite, paintingWall, testPattern, windowWall } from "./sprites";


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

const lever1 = new WallSwitch({ sprite: leverSprite, animation: "OFF" })
const painting1 = new WallFeature({ sprite: paintingWall, animation: Sprite.defaultWallAnimation })
const door1 = new Door({ sprite: doorSprite, animation: 'CLOSED' })

const playerVantage = new Vantage({ x: 0, y: 3, direction: Direction.east });

const level: Level = new Level({
    height: 8, width: 15,
    defaultWallPattern: brickWall,
    walls: [
        new Wall({ x: 1, y: 3, place: Direction.north, features: [lever1] }),
        new Wall({ x: 1, y: 1, place: Direction.south, color: new Color(200, 255, 0), patternSprite: brickWall }),
        new Wall({ x: 1, y: 2, place: Direction.north, color: new Color(200, 100, 90, 1) }),
        new Wall({ x: 3, y: 3, place: Direction.east, shape: doorway, features:[door1], open: true }),
        new Wall({ x: 3, y: 4, place: Direction.east }),
        new Wall({ x: 3, y: 2, place: Direction.east, shape: lowWall }),
        new Wall({ x: 4, y: 3, place: Direction.south, shape: lowWall }),
        new Wall({ x: 5, y: 0, place: Direction.east, shape: lowWall }),
        new Wall({ x: 5, y: 3, place: Direction.south, patternSprite: brickWall, shape: lowWall }),

        new Wall({ x: 9, y: 2, place: Direction.south, patternSprite: brickWall }),
        new Wall({ x: 9, y: 3, place: Direction.south, patternSprite: windowWall }),
        new Wall({ x: 9, y: 4, place: Direction.south, patternSprite: brickWall }),

        new Wall({ x: 0, y: 0, place: Direction.west, patternSprite: brickWall }),
        new Wall({ x: 0, y: 0, place: Direction.north, color: new Color(200, 100, 90, 1) }),
        new Wall({ x: 1, y: 0, place: Direction.north, color: new Color(20, 250, 190) }),
        new Wall({ x: 2, y: 0, place: Direction.north }),
        new Wall({ x: 3, y: 0, place: Direction.north, patternSprite: windowWall }),
        new Wall({ x: 4, y: 0, place: Direction.north, patternSprite: brickWall }),
        new Wall({ x: 5, y: 0, place: Direction.north, patternSprite: windowWall }),
        new Wall({ x: 6, y: 0, place: Direction.north, patternSprite: brickWall }),
        new Wall({ x: 7, y: 0, place: Direction.north }),
        new Wall({ x: 8, y: 0, place: Direction.north }),
        new Wall({ x: 9, y: 0, place: Direction.north }),
        new Wall({ x: 9, y: 0, place: Direction.east, patternSprite: brickWall, features: [painting1] }),
    ],
    contents: [
        duck({ x: 6, y: 1, direction: Direction.east, behaviour: new Behaviour(decisionFunctions.moveClockwise) }),
        duck({ x: 5, y: 0, direction: Direction.west, behaviour: undefined }),
        duck({ x: 4, y: 1, direction: Direction.west, behaviour: undefined }),
        new Figure({ x: 5, y: 3, direction: Direction.west, sprite: dinoSprite, height: .5, width: .5 }),
        new Position({ x: 3, y: 3 }),
    ]
})


export { level, playerVantage }