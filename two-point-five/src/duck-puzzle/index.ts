
import { Game } from "@/game-classes/Game";
import { PlayerVantage } from "@/game-classes/PlayerVantage";
import { spriteSheets as sharedSheets } from "@/instances/sprites";
import { duckPuzzleLevel1, duckPuzzleLevel2, duckPuzzleLevel3 } from "./levels";
import { spriteSheets as localSheets, sprites } from "./sprites";
import { itemTypes } from "./itemTypes";

const spriteSheets = [
    ...sharedSheets,
    ...localSheets,
];

const levels = [
    duckPuzzleLevel3,
    duckPuzzleLevel1,
    duckPuzzleLevel2,
]

const game = new Game({
    level: levels[0],
    levels: levels,
    playerVantage: levels[0].data.startingVantage || { x: 0, y: 0, direction: 'SOUTH' },
    controllers: [],
    activeCharacterIndex: 0,
    characters: [],
    narrativeMessages: [],
}, {
    spriteSheets,
    sprites: Object.values(sprites).map(sprite => sprite.data),
    itemTypeRecord: itemTypes,
}, {
    needCharacterToPickUpItems: false,
    noCharacters: true,
})

export { game, spriteSheets };

