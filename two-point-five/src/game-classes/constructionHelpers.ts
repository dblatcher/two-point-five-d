import { Point } from "@/canvas/canvas-utility";
import { Color } from "@/canvas/Color";
import { Sprite } from "@/canvas/Sprite";
import { WithOptional } from "@/types";
import { Item, ItemInput } from "./Item";
import { ItemType } from "./ItemType";
import { LevelInput } from "./Level";
import { Behaviour, DecisionFunction } from "./Behaviour";
import { Actor, ActorData, ActorInput } from "./Actor";
import { Monster, MonsterData } from "@/rpg-classes/Monster";
import { NonPlayerCharacter, NonPlayerCharacterData } from "@/rpg-classes/NonPlayerCharacter";

export const putWallsAroundLevel = (levelInput: LevelInput, config: { color?: Color, patternSprite?: Sprite, shape?: Point[] } = {}): LevelInput => {
    const { walls, width, height } = levelInput;
    const { color, patternSprite, shape } = config;

    let x = 0, y = 0;
    for (x = 0; x < width; x++) {
        if (!walls.find(wall => Math.floor(wall.x) == x && Math.floor(wall.y) == y && wall.placeName == 'NORTH')) {
            walls.push(({ x, y, placeName: 'NORTH', color: color?.serialise(), patternSprite: patternSprite?.id, shape }))
        }
    }
    x = 0;
    for (y = 0; y < height; y++) {
        if (!walls.find(wall => Math.floor(wall.x) == x && Math.floor(wall.y) == y && wall.placeName == 'WEST')) {
            walls.push(({ x, y, placeName: 'WEST', color: color?.serialise(), patternSprite: patternSprite?.id, shape }))
        }
    }
    y = height - 1;
    for (x = 0; x < width; x++) {
        if (!walls.find(wall => Math.floor(wall.x) == x && Math.floor(wall.y) == y && wall.placeName == 'SOUTH')) {
            walls.push(({ x, y, placeName: 'SOUTH', color: color?.serialise(), patternSprite: patternSprite?.id, shape }))
        }
    }
    x = width - 1;
    for (y = 0; y < height; y++) {
        if (!walls.find(wall => Math.floor(wall.x) == x && Math.floor(wall.y) == y && wall.placeName == 'EAST')) {
            walls.push(({ x, y, placeName: 'EAST', color: color?.serialise(), patternSprite: patternSprite?.id, shape }))
        }
    }
    return levelInput
}

export const makeItemFunction = (itemTypeRecord: Record<string, ItemType>) =>
    (itemTypeId: string | null, config?: WithOptional<'type', ItemInput>) => {
        const itemType = itemTypeId && itemTypeRecord[itemTypeId];
        return itemType ? Item.ofType(itemType, config) : null
    }

export type ImmutableData = {
    spriteRecord: Record<string, Sprite>,
    itemTypeRecord: Record<string, ItemType>,
    decisionFunctions: Record<string, DecisionFunction>
}

export const constructActorFunction = ({ decisionFunctions, spriteRecord }: ImmutableData) => (input: ActorInput): Actor => {
    const decisionFunction = input.behaviour ? decisionFunctions[input.behaviour] : undefined;
    const behaviour = decisionFunction && new Behaviour(decisionFunction, input.behaviour ?? '')
    const sprite = spriteRecord[input.sprite]

    const data: ActorData = {
        ...input,
        sprite,
        behaviour,
    }

    switch (input.actorType) {
        case 'Monster':
            return new Monster(data as MonsterData)
        case 'NonPlayerCharacter': {
            return new NonPlayerCharacter(data as NonPlayerCharacterData)
        }
        default:
            return new Actor(data)
    }
}
