import { Sprite } from "@/canvas/Sprite";
import { Direction } from "@/game-classes/Direction";
import { SquareWithFeaturesData } from "@/game-classes/SquareWithFeatures";
import { WallInput } from "@/game-classes/Wall";
import { doorway } from "@/instances/wallShapes";

function makeHut(x: number, y: number, doorPlacement: Direction = Direction.south, patternSprite?: Sprite): { walls: WallInput[], ceilings: SquareWithFeaturesData[] } {


    const base: { walls: WallInput[], ceilings: SquareWithFeaturesData[] } = {
        walls: [
            ({ x: x + 0, y: y + 0, placeName: 'NORTH', patternSprite: patternSprite?.id }),
            ({ x: x + 0, y: y + 0, placeName: 'WEST', patternSprite: patternSprite?.id }),
            ({ x: x + 1, y: y + 0, placeName: 'NORTH', patternSprite: patternSprite?.id }),
            ({ x: x + 1, y: y + 0, placeName: 'EAST', patternSprite: patternSprite?.id }),
            ({ x: x + 0, y: y + 1, placeName: 'SOUTH', patternSprite: patternSprite?.id }),
            ({ x: x + 0, y: y + 1, placeName: 'WEST', patternSprite: patternSprite?.id }),
            ({ x: x + 1, y: y + 1, placeName: 'SOUTH', patternSprite: patternSprite?.id }),
            ({ x: x + 1, y: y + 1, placeName: 'EAST', patternSprite: patternSprite?.id }),
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

    base.walls[doorwayIndex].shape = doorway;
    base.walls[doorwayIndex].open = true;

    return base;
}

export { makeHut };

