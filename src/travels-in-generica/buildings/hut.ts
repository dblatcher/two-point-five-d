import { Direction } from "@/game-classes/Direction"
import { Wall } from "@/game-classes/Wall"
import { doorway } from "@/instances/wallShapes"
import * as features from "@/travels-in-generica/features"
import { sprites as sharedSprites } from "@/instances/sprites";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";
import { Color } from "@/canvas/Color";
import { Door } from "@/game-classes/WallFeature";

function makeHut(x: number, y: number, wallColor: Color, doorPlacement: Direction = Direction.south): { walls: Wall[], ceilings: SquareWithFeatures[] } {

    const door = new Door({ sprite: sharedSprites.doorSprite, status: "CLOSED", canOpenDirectly: true })

    const base = {
        walls: [
            new Wall({ x: x + 0, y: y + 0, place: Direction.north, color: wallColor }),
            new Wall({ x: x + 0, y: y + 0, place: Direction.west, color: wallColor }),
            new Wall({ x: x + 1, y: y + 0, place: Direction.north, color: wallColor }),
            new Wall({ x: x + 1, y: y + 0, place: Direction.east, color: wallColor }),
            new Wall({ x: x + 0, y: y + 1, place: Direction.south, color: wallColor }),
            new Wall({ x: x + 0, y: y + 1, place: Direction.west, color: wallColor }),
            new Wall({ x: x + 1, y: y + 1, place: Direction.south, color: wallColor }),
            new Wall({ x: x + 1, y: y + 1, place: Direction.east, color: wallColor }),
        ],
        ceilings: [
            new SquareWithFeatures({ x: x + 0, y: y + 0, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 1, y: y + 0, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 0, y: y + 1, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),
            new SquareWithFeatures({ x: x + 1, y: y + 1, direction: Direction.north, floorFeatures: [], ceilingFeatures: [features.brownCeiling] }),

        ]
    }

    let doorwayIndex: number;

    switch (doorPlacement) {
        case Direction.east: doorwayIndex = 7; break;
        case Direction.west: doorwayIndex = 5; break;
        case Direction.north: doorwayIndex = 0; break;
        default:
        case Direction.south: doorwayIndex = 6; break;
    }

    base.walls[doorwayIndex].data.features = [door];
    base.walls[doorwayIndex].data.shape = doorway;
    base.walls[doorwayIndex].data.open = true;

    return base;
}

export { makeHut }