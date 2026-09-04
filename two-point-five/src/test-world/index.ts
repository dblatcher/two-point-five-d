import { Direction } from "@/game-classes/Direction";
import { Game } from "@/game-classes/Game";
import { Level } from "@/game-classes/Level";
import { PlayerVantage } from "@/game-classes/PlayerVantage";
import { Wall } from "@/game-classes/Wall";

import { Color } from "@/canvas/Color";
import { CeilingFeature } from "@/game-classes/CeilingFeature";
import { Controller } from "@/game-classes/Controller";
import { Figure } from "@/game-classes/Figure";
import { Pit } from "@/game-classes/FloorFeature";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";
import { Door, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { spriteSheets as sharedSpriteSheets, sprites } from "@/instances/sprites";
import { vaultDoorway } from "@/instances/wallShapes";
import { spriteSheets as gSpriteSheets, sprites as gSprites } from "@/travels-in-generica/sprites";

const spriteSheets = [
    ...sharedSpriteSheets,
    ...gSpriteSheets
]

const features = {
    painting: new WallFeature({ spriteId: sprites.paintingWall.id }),
    switch: new WallSwitch({ spriteId: sprites.leverSprite.id }),
    door: new Door({ spriteId: sprites.doorSprite.id, status: "CLOSED" }),
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
            new Wall({ x: 6, y: 3, placeName: 'WEST', patternSprite: sprites.brickWall2, featureIds: ["switch"] }),
            new Wall({ x: 6, y: 5, placeName: 'NORTH', shape: vaultDoorway, featureIds: ["door"], open: true }),
            // new Wall({ x: 5, y: 7, place: 'NORTH', shape: tower, patternSprite: sprites.testPattern, }),
        ],
        items: [

        ],
        squaresWithFeatures: [
            new SquareWithFeatures({ x: 7, y: 4, direction: 'NORTH', floorFeatureIds: ["pitOne"] }),
            new SquareWithFeatures({ x: 8, y: 5, direction: 'NORTH', ceilingFeatureIds: ["redCeiling"] }),
        ],
        staticFigures: [
            new Figure({ x: 9.5, y: 2.5, direction: 'SOUTH', sprite: gSprites.treeOne }),
        ],
        features,
        controllers: [
            new Controller({
                inputIds: ["switch"], subjectId: "door", statusMap: [
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
        playerVantage: new PlayerVantage(levels[0].data.startingVantage || { x: 7, y: 0, direction: 'SOUTH' }),
        controllers: [],
        characters: [],
        activeCharacterIndex: undefined,
        spriteSheets,
        narrativeMessages: [],
        sprites: Object.values(sprites).map(sprite => sprite.data),
    },
    { noCharacters: true }
)

export { game, spriteSheets };
