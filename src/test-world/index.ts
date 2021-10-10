import { Direction } from "@/game-classes/Direction";
import { Game } from "@/game-classes/Game";
import { Level } from "@/game-classes/Level";
import { PlayerVantage } from "@/game-classes/PlayerVantage";
import { Wall } from "@/game-classes/Wall";

import { spriteSheets as sharedSpriteSheets, sprites } from "@/instances/sprites";
import { spriteSheets as gSpriteSheets, sprites as gSprites } from "@/travels-in-generica/sprites";
import { tower, vaultDoorway } from "@/instances/wallShapes";
import { Figure } from "@/game-classes/Figure";
import { Door, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { Controller } from "@/game-classes/Controller";
import { Pit } from "@/game-classes/FloorFeature";
import { CeilingFeature } from "@/game-classes/CeilingFeature";
import { Color } from "@/canvas/Color";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";

const spriteSheets = [
    ...sharedSpriteSheets,
    ...gSpriteSheets
]

const features = {
    painting: new WallFeature({ sprite: sprites.paintingWall }),
    switch: new WallSwitch({ sprite: sprites.leverSprite }),
    door: new Door({ sprite: sprites.doorSprite, status: "CLOSED" }),
    pitOne: new Pit({ status: "OPEN" }),
    grayCeiling: new CeilingFeature({ plotConfig: { fillStyle: 'gray', strokeStyle: 'gray' } }),
    redCeiling: new CeilingFeature({ plotConfig: { fillStyle: Color.RED.css, strokeStyle: Color.YELLOW.css } }),

}

const levels = [
    new Level({
        height: 10,
        width: 10,
        walls: [
            // new Wall({ x: 6, y: 4, place: Direction.west, shape: vaultDoorway, patternSprite: sprites.brickWall, }),
            new Wall({ x: 6, y: 3, place: Direction.west, patternSprite: sprites.brickWall2, featureIds: ["switch"] }),
            new Wall({ x: 6, y: 5, place: Direction.north, shape: vaultDoorway, featureIds: ["door"], open: true }),
            // new Wall({ x: 5, y: 7, place: Direction.north, shape: tower, patternSprite: sprites.testPattern, }),
        ],
        items: [

        ],
        squaresWithFeatures: [
            new SquareWithFeatures({ x: 7, y: 4, direction: Direction.north, floorFeatureIds: ["pitOne"] }),
            new SquareWithFeatures({ x: 8, y: 5, direction: Direction.north, ceilingFeatureIds: ["redCeiling"] }),
        ],
        staticFigures: [
            new Figure({ x: 9.5, y: 2.5, direction: Direction.south, sprite: gSprites.treeOne }),
        ],
        features,
        controllers: [
            new Controller({
                inputs: [features.switch], subject: features.door, statusMap: [
                    [["ON"], "OPEN"],
                    [["OFF"], "CLOSED"],
                ]
            })
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