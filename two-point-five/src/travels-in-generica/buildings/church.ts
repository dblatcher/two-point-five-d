import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";
import { Wall } from "@/game-classes/Wall";
import { sprites as sharedSprites } from "@/instances/sprites";
import { doorway, tower, vaultDoorway } from "@/instances/wallShapes";

function makeChurch(x: number, y: number): { walls: Wall[], ceilings: SquareWithFeatures[] } {


    return {
        walls: [
            new Wall({ x: x + 2, y: y + 2, placeName: 'SOUTH',shape: tower, patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 2, y: y + 2, placeName: 'WEST', shape: tower, patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 2, y: y + 2, placeName: 'EAST', shape: tower, patternSprite: sharedSprites.brickWall, }),

            new Wall({ x: x + 3, y: y + 2, placeName: 'NORTH',shape: doorway, open: true, patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 3, y: y + 3, placeName: 'NORTH',shape: vaultDoorway, open: true, patternSprite: sharedSprites.brickWall, }),

            new Wall({ x: x + 4, y: y + 3, placeName: 'NORTH', shape: tower, featureIds:["poemBoard"], patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 4, y: y + 2, placeName: 'WEST', shape: tower, patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 4, y: y + 2, placeName: 'EAST', shape: tower, patternSprite: sharedSprites.brickWall, }),

            new Wall({ x: x + 2, y: y + 1, placeName: 'WEST', patternSprite: sharedSprites.windowWall, }),
            new Wall({ x: x + 2, y: y + 0, placeName: 'WEST', patternSprite: sharedSprites.windowWall, }),
            new Wall({ x: x + 2, y: y + 0, placeName: 'NORTH', patternSprite: sharedSprites.brickWall, featureIds: ["painting1"] }),
            new Wall({ x: x + 3, y: y + 0, placeName: 'NORTH', patternSprite: sharedSprites.windowWall,  }),
            new Wall({ x: x + 4, y: y + 0, placeName: 'NORTH', patternSprite: sharedSprites.brickWall, featureIds: ["painting1"]}),
            new Wall({ x: x + 4, y: y + 0, placeName: 'EAST', patternSprite: sharedSprites.windowWall, }),
            new Wall({ x: x + 4, y: y + 1, placeName: 'EAST', patternSprite: sharedSprites.windowWall, }),
        ],
        ceilings: [
            new SquareWithFeatures({ x: x + 2, y: y + 0, direction: 'NORTH',  ceilingFeatureIds: ["brownCeiling"] }),
            new SquareWithFeatures({ x: x + 3, y: y + 0, direction: 'NORTH',  ceilingFeatureIds: ["brownCeiling"] }),
            new SquareWithFeatures({ x: x + 4, y: y + 0, direction: 'NORTH',  ceilingFeatureIds: ["brownCeiling"] }),
            new SquareWithFeatures({ x: x + 2, y: y + 1, direction: 'NORTH',  ceilingFeatureIds: ["brownCeiling"] }),
            new SquareWithFeatures({ x: x + 3, y: y + 1, direction: 'NORTH',  ceilingFeatureIds: ["brownCeiling"] }),
            new SquareWithFeatures({ x: x + 4, y: y + 1, direction: 'NORTH',  ceilingFeatureIds: ["brownCeiling"] }),

            new SquareWithFeatures({ x: x + 2, y: y + 2, direction: 'NORTH',  ceilingFeatureIds: ["brownCeiling"] }),
            new SquareWithFeatures({ x: x + 3, y: y + 2, direction: 'NORTH',  ceilingFeatureIds: ["grayCeiling"] }),
            new SquareWithFeatures({ x: x + 4, y: y + 2, direction: 'NORTH',  ceilingFeatureIds: ["brownCeiling"] }),
        ]
    }

}

export { makeChurch };
