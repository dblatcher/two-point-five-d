import { Color } from "@/canvas/Color";
import { CeilingFeature } from "@/game-classes/CeilingFeature";
import { Pit } from "@/game-classes/FloorFeature";
import { Game } from "@/game-classes/Game";
import { LevelInput } from "@/game-classes/Level";
import { Door, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { itemTypes } from "@/instances/itemTypes";
import { spriteSheets as sharedSpriteSheets, sprites } from "@/instances/sprites";
import { vaultDoorway } from "@/instances/wallShapes";
import { spriteSheets as gSpriteSheets, sprites as gSprites } from "@/travels-in-generica/sprites";
import { NonEmptyArray } from "@/types";

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

const levels: NonEmptyArray<LevelInput> = [
    {
        id: 'test-level',
        height: 10,
        width: 10,
        walls: [
            ({ x: 6, y: 3, placeName: 'WEST', patternSprite: sprites.brickWall2.id, featureIds: ["switch"] }),
            ({ x: 6, y: 5, placeName: 'NORTH', shape: vaultDoorway, featureIds: ["door"], open: true }),
        ],
        items: [

        ],
        squaresWithFeatures: [
            { x: 7, y: 4, direction: 'NORTH', floorFeatureIds: ["pitOne"] },
            { x: 8, y: 5, direction: 'NORTH', ceilingFeatureIds: ["redCeiling"] },
        ],
        staticFigures: [
            { x: 9.5, y: 2.5, direction: 'SOUTH', spriteId: gSprites.treeOne.id },
        ],
        features,
        controllers: [
            {
                inputIds: ["switch"], subjectId: "door", statusMap: [
                    [["ON"], "OPEN"],
                    [["OFF"], "CLOSED"],
                ]
            }
        ]
    }
]

const game = new Game(
    {
        levels: levels,
        playerVantage: levels[0].startingVantage || { x: 7, y: 0, direction: 'SOUTH' },
        controllers: [],
        characters: [],
        activeCharacterIndex: undefined,
        narrativeMessages: [],
    },
    {
        spriteSheets,
        sprites: Object.values(sprites).map(sprite => sprite.data),
        itemTypeRecord: itemTypes,
    },
    { noCharacters: true }
)

export { game, spriteSheets };

