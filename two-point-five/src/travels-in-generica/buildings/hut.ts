import { Sprite } from "@/canvas/Sprite";
import { Direction } from "@/game-classes/Direction";
import { SquareWithFeaturesData } from "@/game-classes/SquareWithFeatures";
import { Wall } from "@/game-classes/Wall";
import { doorway } from "@/instances/wallShapes";

function makeHut(x: number, y: number, doorPlacement: Direction = Direction.south, patternSprite?: Sprite): { walls: Wall[], ceilings: SquareWithFeaturesData[] } {


    const base: { walls: Wall[], ceilings: SquareWithFeaturesData[] } = {
        walls: [
            new Wall({ x: x + 0, y: y + 0, placeName: 'NORTH', patternSprite }),
            new Wall({ x: x + 0, y: y + 0, placeName: 'WEST', patternSprite }),
            new Wall({ x: x + 1, y: y + 0, placeName: 'NORTH', patternSprite }),
            new Wall({ x: x + 1, y: y + 0, placeName: 'EAST', patternSprite }),
            new Wall({ x: x + 0, y: y + 1, placeName: 'SOUTH', patternSprite }),
            new Wall({ x: x + 0, y: y + 1, placeName: 'WEST', patternSprite }),
            new Wall({ x: x + 1, y: y + 1, placeName: 'SOUTH', patternSprite }),
            new Wall({ x: x + 1, y: y + 1, placeName: 'EAST', patternSprite }),
        ],
        ceilings: [
            { x: x + 0, y: y + 0, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 1, y: y + 0, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 0, y: y + 1, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
            { x: x + 1, y: y + 1, direction: 'NORTH', ceilingFeatureIds: ["brownCeiling"] },
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

    base.walls[doorwayIndex].data.shape = doorway;
    base.walls[doorwayIndex].data.open = true;

    return base;
}

export { makeHut };
