import { Point } from "@/canvas/canvas-utility";
import { Color } from "@/canvas/Color";
import { Sprite } from "@/canvas/Sprite";
import { WithOptional } from "@/types";
import { Direction } from "./Direction";
import { Item, ItemInput } from "./Item";
import { ItemType } from "./ItemType";
import { LevelInput } from "./Level";
import { Wall } from "./Wall";

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

export const makeItemFunction = (itemTypeRecord: Record<string, ItemType>) =>
    (itemTypeId: string | null, config?: WithOptional<'type', ItemInput>) => {
        const itemType = itemTypeId && itemTypeRecord[itemTypeId];
        return itemType ? Item.ofType(itemType, config) : null
    }
