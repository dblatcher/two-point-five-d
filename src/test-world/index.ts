import { Color } from "@/canvas/Color";
import { genericDecisionFunctions } from "@/game-classes/decisionFunctions";
import { Game } from "@/game-classes/Game";
import { LevelInput } from "@/game-classes/Level";
import { itemTypes } from "@/instances/itemTypes";
import { spriteSheets as sharedSpriteSheets, sprites } from "@/instances/sprites";
import { vaultDoorway } from "@/instances/wallShapes";
import { spriteSheets as gSpriteSheets, sprites as gSprites } from "@/travels-in-generica/sprites";
import { NonEmptyArray } from "@/types";

const spriteSheets = [
    ...sharedSpriteSheets,
    ...gSpriteSheets
]

const levels: NonEmptyArray<LevelInput> = [
    {
        id: 'test-level',
        height: 10,
        width: 10,
        walls: [
            { x: 6, y: 3, placeName: 'WEST', patternSprite: sprites.brickWall2.id, featureIds: ["switch"] },
            { x: 6, y: 5, placeName: 'NORTH', shape: vaultDoorway, featureIds: ["door"], open: true },
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
        features: {
            painting: { featureType: 'WallFeature', spriteId: sprites.paintingWall.id },
            switch: { featureType: 'WallSwitch', spriteId: sprites.leverSprite.id },
            door: { featureType: 'Door', spriteId: sprites.doorSprite.id, status: "CLOSED" },
            pitOne: { featureType: 'Pit', status: "OPEN" },
            grayCeiling: { featureType: 'CeilingFeature', plotConfig: { fillStyle: 'gray', strokeStyle: 'gray' } },
            redCeiling: { featureType: 'CeilingFeature', plotConfig: { fillStyle: Color.RED.css, strokeStyle: Color.YELLOW.css } },
        },
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
        playerVantage: levels[0].startingVantage || [7, 0, 'SOUTH'],
        controllers: [],
        characters: [],
        activeCharacterIndex: undefined,
        narrativeMessages: [],
    },
    {
        spriteSheets,
        sprites: Object.values(sprites).map(sprite => sprite.data),
        itemTypeRecord: itemTypes,
        decisionFunctions: genericDecisionFunctions,
    },
    { noCharacters: true }
)

export { game, spriteSheets };

