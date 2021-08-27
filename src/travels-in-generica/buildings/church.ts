import { Direction } from "@/game-classes/Direction"
import { Wall } from "@/game-classes/Wall"
import { tower, towerUpper, doorway, vaultDoorway } from "@/instances/wallShapes"
import * as features from "@/travels-in-generica/features"
import { sprites as sharedSprites } from "@/instances/sprites";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";

function makeChurch(x: number, y: number): { walls: Wall[], ceilings: SquareWithFeatures[] } {


    return {
        walls: [
            new Wall({ x: x + 2, y: y + 3, place: Direction.north, features: [features.poemBoard], shape: tower, patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 2, y: y + 2, place: Direction.west, shape: tower, patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 2, y: y + 2, place: Direction.east, shape: tower, patternSprite: sharedSprites.brickWall, }),

            new Wall({ x: x + 3, y: y + 2, place: Direction.north, features: [], shape: doorway, open: true, patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 3, y: y + 3, place: Direction.north, features: [], shape: vaultDoorway, open: true, patternSprite: sharedSprites.brickWall, }),

            new Wall({ x: x + 4, y: y + 3, place: Direction.north, shape: tower, patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 4, y: y + 2, place: Direction.west, shape: tower, patternSprite: sharedSprites.brickWall, }),
            new Wall({ x: x + 4, y: y + 2, place: Direction.east, shape: tower, patternSprite: sharedSprites.brickWall, }),

            new Wall({ x: x + 2, y: y + 1, place: Direction.west, patternSprite: sharedSprites.windowWall, }),
            new Wall({ x: x + 2, y: y + 0, place: Direction.west, patternSprite: sharedSprites.windowWall, }),
            new Wall({ x: x + 2, y: y + 0, place: Direction.north, patternSprite: sharedSprites.brickWall, features: [features.painting1] }),
            new Wall({ x: x + 3, y: y + 0, place: Direction.north, patternSprite: sharedSprites.windowWall,  }),
            new Wall({ x: x + 4, y: y + 0, place: Direction.north, patternSprite: sharedSprites.brickWall, features: [features.painting1]}),
            new Wall({ x: x + 4, y: y + 0, place: Direction.east, patternSprite: sharedSprites.windowWall, }),
            new Wall({ x: x + 4, y: y + 1, place: Direction.east, patternSprite: sharedSprites.windowWall, }),
        ],
        ceilings: [
            new SquareWithFeatures({ x: x + 2, y: y + 0, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 3, y: y + 0, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 4, y: y + 0, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 2, y: y + 1, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 3, y: y + 1, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 4, y: y + 1, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),

            new SquareWithFeatures({ x: x + 2, y: y + 2, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 3, y: y + 2, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.grayCeiling] }),
            new SquareWithFeatures({ x: x + 4, y: y + 2, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
        ]
    }

}

export { makeChurch }