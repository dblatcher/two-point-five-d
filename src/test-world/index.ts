import { Direction } from "@/game-classes/Direction";
import { Game } from "@/game-classes/Game";
import { Level } from "@/game-classes/Level";
import { PlayerVantage } from "@/game-classes/PlayerVantage";
import { Wall } from "@/game-classes/Wall";

import { spriteSheets, sprites } from "@/instances/sprites";
import { tower, vaultDoorway } from "@/instances/wallShapes";

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

        ]
    })
]

const game = new Game(
    {
        level: levels[0],
        levels: levels,
        playerVantage: new PlayerVantage(levels[0].data.startingVantage || { x: 5, y: 0, direction: Direction.south }),
        controllers: [],
        characters: [],
        activeCharacterIndex: undefined,
    },
    { noCharacters: true }
)

export { game, spriteSheets }