import { Direction } from "@/game-classes/Direction";
import { Game } from "@/game-classes/Game";
import { Level } from "@/game-classes/Level";
import { PlayerVantage } from "@/game-classes/PlayerVantage";
import { Wall } from "@/game-classes/Wall";

import { spriteSheets as sharedSpriteSheets, sprites } from "@/instances/sprites";
import { spriteSheets as gSpriteSheets, sprites as gSprites } from "@/travels-in-generica/sprites";
import { tower, vaultDoorway } from "@/instances/wallShapes";
import { Figure } from "@/game-classes/Figure";

const spriteSheets = [
    ...sharedSpriteSheets,
    ...gSpriteSheets
]

const levels = [ 
    new Level({
        height:10,
        width:10,
        walls:[
            new Wall({ x: 6, y: 4, place: Direction.west, shape: vaultDoorway, patternSprite: sprites.brickWall, }),
            new Wall({ x: 6, y: 3, place: Direction.west, patternSprite: sprites.brickWall2, }),
            new Wall({ x: 3, y: 5, place: Direction.west, shape: tower, patternSprite: sprites.testPattern, }),
            new Wall({ x: 5, y: 7, place: Direction.north, shape: tower, patternSprite: sprites.testPattern, }),
        ],
        items:[

        ],
        staticFigures: [
            new Figure({x:6.5, y:2.5, direction:Direction.south, sprite:gSprites.treeOne}),
            new Figure({x:7.5, y:3.5, direction:Direction.south, sprite:gSprites.treeTwo}),
            new Figure({x:8.5, y:4.5, direction:Direction.south, sprite:gSprites.treeOne}),
            // new Figure({x:6.5, y:2.5, direction:Direction.south, sprite:sprites.testSprite}),
        ]
    })
]

const game = new Game(
    {
        level: levels[0],
        levels: levels,
        playerVantage: new PlayerVantage(levels[0].data.startingVantage || { x: 7, y: 0, direction: Direction.south }),
        controllers: [],
        characters: [],
        activeCharacterIndex: undefined,
        spriteSheets,
    },
    { noCharacters: true }
)

export { game, spriteSheets }