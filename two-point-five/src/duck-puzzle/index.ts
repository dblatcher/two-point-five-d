
import { Game } from "@/game-classes/Game";
import { LevelInput } from "@/game-classes/Level";
import { spriteSheets as sharedSheets, sprites as sharedSprites } from "@/instances/sprites";
import { NonEmptyArray } from "@/types";
import { itemTypes } from "./itemTypes";
import { duckPuzzleLevel1, duckPuzzleLevel2, duckPuzzleLevel3 } from "./levels";
import { spriteSheets as duckPuzzleSheets, duckPuzzleSprites } from "./sprites";

const allSpriteSheets = [
    ...sharedSheets,
    ...duckPuzzleSheets,
];

const allSprites = {
    ...sharedSprites,
    ...duckPuzzleSprites,
}

const levels: NonEmptyArray<LevelInput> = [
    duckPuzzleLevel1.data,
    duckPuzzleLevel2.data,
    duckPuzzleLevel3.data,
]

const game = new Game({
    levels: levels,
    playerVantage: levels[0].startingVantage || { x: 0, y: 0, direction: 'SOUTH' },
    controllers: [],
    activeCharacterIndex: 0,
    characters: [],
    narrativeMessages: [],
}, {
    spriteSheets: allSpriteSheets,
    sprites: Object.values(allSprites).map(sprite => sprite.data),
    itemTypeRecord: itemTypes,
}, {
    needCharacterToPickUpItems: false,
    noCharacters: true,
})

export { game, allSpriteSheets as spriteSheets };

