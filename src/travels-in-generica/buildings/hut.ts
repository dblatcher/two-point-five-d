import { Sprite } from "@/canvas/Sprite";
import { setWallInputOptions } from "@/game-classes/constructionHelpers";
import { Direction } from "@/game-classes/Direction";
import { SquareWithFeaturesData } from "@/game-classes/SquareWithFeatures";
import { WallInput } from "@/game-classes/Wall";
import { doorway } from "@/instances/wallShapes";

function makeHut(x: number, y: number, doorPlacement: Direction = Direction.south, patternSprite?: Sprite): { walls: WallInput[], ceilings: SquareWithFeaturesData[] } {

    const base: { walls: WallInput[], ceilings: SquareWithFeaturesData[] } = {
        walls: [
            [x + 0, y + 0, 'NORTH', { patternSprite: patternSprite?.id }],
            [x + 0, y + 0, 'WEST', { patternSprite: patternSprite?.id }],
            [x + 1, y + 0, 'NORTH', { patternSprite: patternSprite?.id }],
            [x + 1, y + 0, 'EAST', { patternSprite: patternSprite?.id }],
            [x + 0, y + 1, 'SOUTH', { patternSprite: patternSprite?.id }],
            [x + 0, y + 1, 'WEST', { patternSprite: patternSprite?.id }],
            [x + 1, y + 1, 'SOUTH', { patternSprite: patternSprite?.id }],
            [x + 1, y + 1, 'EAST', { patternSprite: patternSprite?.id }],
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

    setWallInputOptions(base.walls[doorwayIndex], { shape: doorway, open: true })
    return base;
}

export { makeHut };

