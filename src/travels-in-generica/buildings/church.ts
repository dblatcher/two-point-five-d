import { SquareWithFeaturesData } from "@/game-classes/SquareWithFeatures";
import { WallInput } from "@/game-classes/Wall";
import { sprites as sharedSprites } from "@/instances/sprites";
import { doorway, tower, vaultDoorway } from "@/instances/wallShapes";

function makeChurch(x: number, y: number): { walls: WallInput[], ceilings: SquareWithFeaturesData[] } {

    return {
        walls: [
            ({ x: x + 2, y: y + 2, placeName: 'SOUTH', shape: tower, patternSprite: sharedSprites.brickWall.id, }),
            ({ x: x + 2, y: y + 2, placeName: 'WEST', shape: tower, patternSprite: sharedSprites.brickWall.id, }),
            ({ x: x + 2, y: y + 2, placeName: 'EAST', shape: tower, patternSprite: sharedSprites.brickWall.id, }),

            ({ x: x + 3, y: y + 2, placeName: 'NORTH', shape: doorway, open: true, patternSprite: sharedSprites.brickWall.id, }),
            ({ x: x + 3, y: y + 3, placeName: 'NORTH', shape: vaultDoorway, open: true, patternSprite: sharedSprites.brickWall.id, }),

            ({ x: x + 4, y: y + 3, placeName: 'NORTH', shape: tower, featureIds: ["poemBoard"], patternSprite: sharedSprites.brickWall.id, }),
            ({ x: x + 4, y: y + 2, placeName: 'WEST', shape: tower, patternSprite: sharedSprites.brickWall.id, }),
            ({ x: x + 4, y: y + 2, placeName: 'EAST', shape: tower, patternSprite: sharedSprites.brickWall.id, }),

            ({ x: x + 2, y: y + 1, placeName: 'WEST', patternSprite: sharedSprites.windowWall.id, }),
            ({ x: x + 2, y: y + 0, placeName: 'WEST', patternSprite: sharedSprites.windowWall.id, }),
            ({ x: x + 2, y: y + 0, placeName: 'NORTH', patternSprite: sharedSprites.brickWall.id, featureIds: ["painting1"] }),
            ({ x: x + 3, y: y + 0, placeName: 'NORTH', patternSprite: sharedSprites.windowWall.id, }),
            ({ x: x + 4, y: y + 0, placeName: 'NORTH', patternSprite: sharedSprites.brickWall.id, featureIds: ["painting1"] }),
            ({ x: x + 4, y: y + 0, placeName: 'EAST', patternSprite: sharedSprites.windowWall.id, }),
            ({ x: x + 4, y: y + 1, placeName: 'EAST', patternSprite: sharedSprites.windowWall.id, }),
        ],
        ceilings: [
            { x: x + 2, y: y + 0, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 3, y: y + 0, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 4, y: y + 0, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 2, y: y + 1, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 3, y: y + 1, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 4, y: y + 1, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 2, y: y + 2, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 3, y: y + 2, direction: 'NORTH', ceilingFeatureIds: ["grayCeiling"] },
            { x: x + 4, y: y + 2, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
        ]
    }

}

export { makeChurch };

