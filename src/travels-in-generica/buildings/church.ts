import { SquareWithFeaturesData } from "@/game-classes/SquareWithFeatures";
import { WallInput } from "@/game-classes/Wall";
import { sprites as sharedSprites } from "@/instances/sprites";
import { doorway, tower, vaultDoorway } from "@/instances/wallShapes";

function makeChurch(x: number, y: number): { walls: WallInput[], ceilings: SquareWithFeaturesData[] } {

    return {
        walls: [
            ({ place: [x + 2, y + 2, 'SOUTH'], shape: tower, patternSprite: sharedSprites.brickWall.id, }),
            ({ place: [x + 2, y + 2, 'WEST'], shape: tower, patternSprite: sharedSprites.brickWall.id, }),
            ({ place: [x + 2, y + 2, 'EAST'], shape: tower, patternSprite: sharedSprites.brickWall.id, }),

            ({ place: [x + 3, y + 2, 'NORTH'], shape: doorway, open: true, patternSprite: sharedSprites.brickWall.id, }),
            ({ place: [x + 3, y + 3, 'NORTH'], shape: vaultDoorway, open: true, patternSprite: sharedSprites.brickWall.id, }),

            ({ place: [x + 4, y + 3, 'NORTH'], shape: tower, featureIds: ["poemBoard"], patternSprite: sharedSprites.brickWall.id, }),
            ({ place: [x + 4, y + 2, 'WEST'], shape: tower, patternSprite: sharedSprites.brickWall.id, }),
            ({ place: [x + 4, y + 2, 'EAST'], shape: tower, patternSprite: sharedSprites.brickWall.id, }),

            ({ place: [x + 2, y + 1, 'WEST'], patternSprite: sharedSprites.windowWall.id, }),
            ({ place: [x + 2, y + 0, 'WEST'], patternSprite: sharedSprites.windowWall.id, }),
            ({ place: [x + 2, y + 0, 'NORTH'], patternSprite: sharedSprites.brickWall.id, featureIds: ["painting1"] }),
            ({ place: [x + 3, y + 0, 'NORTH'], patternSprite: sharedSprites.windowWall.id, }),
            ({ place: [x + 4, y + 0, 'NORTH'], patternSprite: sharedSprites.brickWall.id, featureIds: ["painting1"] }),
            ({ place: [x + 4, y + 0, 'EAST'], patternSprite: sharedSprites.windowWall.id, }),
            ({ place: [x + 4, y + 1, 'EAST'], patternSprite: sharedSprites.windowWall.id, }),
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

