import { Point } from "@/canvas/canvas-utility";
import { Color } from "@/game-classes/Color";
import { Direction } from "@/game-classes/Direction";
import { Duck } from "@/game-classes/Duck";
import { Figure } from "@/game-classes/Figure";
import { Level } from "@/game-classes/Level";
import { Position } from "@/game-classes/Position";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { brickWall, dinoSprite, duckSprite, paintingWall, windowWall } from "./sprites";


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

const position = new Vantage({ x: 11, y: 0, direction: Direction.west });

const floor: Level = new Level({
    height: 8, width: 15,
    defaultWallPattern: brickWall,
    walls: [
        new Wall({ x: 1, y: 3, place: Direction.north }),
        new Wall({ x: 1, y: 1, place: Direction.south, color: new Color(200, 255, 0), patternSprite: brickWall }),
        new Wall({ x: 1, y: 2, place: Direction.north, color: new Color(200, 100, 90, 1) }),
        new Wall({ x: 3, y: 3, place: Direction.east, shape: lowWall, patternSprite: brickWall }),
        new Wall({ x: 3, y: 3, place: Direction.north, shape: lowWall }),
        new Wall({ x: 3, y: 3, place: Direction.south, shape: lowWall }),
        new Wall({ x: 4, y: 3, place: Direction.south, shape: lowWall }),
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
        new Wall({ x: 9, y: 0, place: Direction.east, patternSprite: brickWall, featureSprites: [paintingWall] }),
    ],
    contents: [
        new Duck({ x: 6, y: 1, direction: Direction.east }),
        new Figure({ x: 5, y: 1, direction: Direction.west, sprite: duckSprite }),
        new Figure({ x: 2, y: 3, direction: Direction.west, sprite: dinoSprite, height: .25, width: .25 }),
        new Position({ x: 3, y: 3 }),
    ]
})


export { floor, position }