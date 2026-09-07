import { Color } from "@/canvas/Color";
import { LevelInput } from "./Level";
import { Point } from "@/canvas/canvas-utility";
import { Sprite } from "@/canvas/Sprite";
import { Wall } from "./Wall";
import { Direction } from "./Direction";

export const putWallsAroundLevel = (levelInput: LevelInput, config: { color?: Color, patternSprite?: Sprite, shape?: Point[] } = {}): LevelInput => {
    const { walls, width, height } = levelInput;
    const { color, patternSprite, shape } = config;

    let x = 0, y = 0;
    for (x = 0; x < width; x++) {
        if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.place == Direction.north)) {
            walls.push(new Wall({ x, y, placeName: 'NORTH', color, patternSprite, shape }))
        }
    }
    x = 0;
    for (y = 0; y < height; y++) {
        if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.place == Direction.west)) {
            walls.push(new Wall({ x, y, placeName: 'WEST', color, patternSprite, shape }))
        }
    }
    y = height - 1;
    for (x = 0; x < width; x++) {
        if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.place == Direction.south)) {
            walls.push(new Wall({ x, y, placeName: 'SOUTH', color, patternSprite, shape }))
        }
    }
    x = width - 1;
    for (y = 0; y < height; y++) {
        if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.place == Direction.east)) {
            walls.push(new Wall({ x, y, placeName: 'EAST', color, patternSprite, shape }))
        }
    }
    return levelInput
}
