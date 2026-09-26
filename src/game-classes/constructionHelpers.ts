import { Point } from "@/canvas/canvas-utility";
import { Color } from "@/canvas/Color";
import { Sprite } from "@/canvas/Sprite";
import { Monster, MonsterInput } from "@/rpg-classes/Monster";
import { NonPlayerCharacter, NonPlayerCharacterInput } from "@/rpg-classes/NonPlayerCharacter";
import { WithOptional } from "@/types";
import { Actor, ActorInput } from "./Actor";
import { Behaviour, DecisionFunction } from "./Behaviour";
import { Item, ItemInput } from "./Item";
import { ItemType } from "./ItemType";
import { LevelInput } from "./Level";
import { AbstractFeature } from "./AbstractFeature";
import { Door, DoorInput, WallFeature, WallFeatureInput, WallSwitch, WallSwitchInput } from "./WallFeature";
import { FloorFeature, FloorFeatureInput, Pit, PitInput } from "./FloorFeature";
import { CeilingFeature, CeilingFeatureInput } from "./CeilingFeature";
import { CardinalDirectionName } from "./Direction";
import { WallInput } from "./Wall";

export const putWallsAroundLevel = (levelInput: LevelInput, config: { color?: Color, patternSprite?: Sprite, shape?: Point[] } = {}): LevelInput => {
    const { walls, width, height } = levelInput;
    const { color, patternSprite, shape } = config;

    const makeWall = (direction: CardinalDirectionName): WallInput => ({ place: [x, y, direction], color: color?.serialise(), patternSprite: patternSprite?.id, shape })

    let x = 0, y = 0;
    for (x = 0; x < width; x++) {
        if (!walls.find(wall => Math.floor(wall.place[0]) == x && Math.floor(wall.place[1]) == y && wall.place[2] == 'NORTH')) {
            walls.push(makeWall('NORTH'))
        }
    }
    x = 0;
    for (y = 0; y < height; y++) {
        if (!walls.find(wall => Math.floor(wall.place[0]) == x && Math.floor(wall.place[1]) == y && wall.place[2] == 'WEST')) {
            walls.push(makeWall('WEST'))
        }
    }
    y = height - 1;
    for (x = 0; x < width; x++) {
        if (!walls.find(wall => Math.floor(wall.place[0]) == x && Math.floor(wall.place[1]) == y && wall.place[2] == 'SOUTH')) {
            walls.push(makeWall('SOUTH'))
        }
    }
    x = width - 1;
    for (y = 0; y < height; y++) {
        if (!walls.find(wall => Math.floor(wall.place[0]) == x && Math.floor(wall.place[1]) == y && wall.place[2] == 'EAST')) {
            walls.push(makeWall('EAST'))
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


    switch (input.actorType) {
        case 'Monster':
            return new Monster(input as MonsterInput, sprite, behaviour)
        case 'NonPlayerCharacter': {
            return new NonPlayerCharacter(input as NonPlayerCharacterInput, sprite, behaviour)
        }
        default:
            return new Actor(input, sprite, behaviour)
    }
}

export function mapRecord<InputValue, OutputValue>(convertFunction: { (input: InputValue): OutputValue }, input?: Record<string, InputValue>): Record<string, OutputValue> {
    if (!input) {
        return {}
    }
    return Object.entries(input).reduce(
        (record, [key, config]) => ({ ...record, [key]: convertFunction(config) }),
        {}
    )
}

export type SupportedFeatureConfig = WallFeatureInput | WallSwitchInput | DoorInput | FloorFeatureInput | CeilingFeatureInput | PitInput
export const constructFeature = (input: SupportedFeatureConfig): AbstractFeature => {

    switch (input.featureType) {
        case 'Door': return new Door(input as DoorInput);
        case 'WallSwitch': return new WallSwitch(input as WallSwitchInput);
        case 'Pit': return new Pit(input as PitInput)

        case 'FloorFeature': return new FloorFeature(input)
        case 'WallFeature': return new WallFeature(input)
        case 'CeilingFeature': return new CeilingFeature(input)
        default: return new CeilingFeature(input)
    }
}