import { Direction } from "@/game-classes/Direction"
import { Wall } from "@/game-classes/Wall"
import { tower, towerUpper, doorway, vaultDoorway } from "@/instances/wallShapes"
import * as features from "@/travels-in-generica/features"
import { sprites as sharedSprites } from "@/instances/sprites";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";
import { Color } from "@/canvas/Color";
import { Door } from "@/game-classes/WallFeature";

function makeHut(x: number, y: number, wallColor: Color): { walls: Wall[], ceilings: SquareWithFeatures[] } {

    const door = new Door({sprite:sharedSprites.doorSprite, status:"CLOSED", canOpenDirectly:true})

    return {
        walls: [
            new Wall({ x: x + 0, y: y + 0, place: Direction.north, color: wallColor }),
            new Wall({ x: x + 0, y: y + 0, place: Direction.west, color: wallColor }),
            new Wall({ x: x + 1, y: y + 0, place: Direction.north, color: wallColor }),
            new Wall({ x: x + 1, y: y + 0, place: Direction.east, color: wallColor }),
            new Wall({ x: x + 0, y: y + 1, place: Direction.south, color: wallColor }),
            new Wall({ x: x + 0, y: y + 1, place: Direction.west, color: wallColor }),
            new Wall({ x: x + 1, y: y + 1, place: Direction.south, color: wallColor, shape: doorway, open: true, features:[door] }),
            new Wall({ x: x + 1, y: y + 1, place: Direction.east, color: wallColor }),
        ],
        ceilings: [
            new SquareWithFeatures({ x: x + 0, y: y + 0, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 1, y: y + 0, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 0, y: y + 1, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 1, y: y + 1, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),

        ]
    }

}

export { makeHut }