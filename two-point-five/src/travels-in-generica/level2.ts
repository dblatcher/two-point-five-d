import { Color } from "@/canvas/Color";
import { Direction } from "@/game-classes/Direction";
import { Item } from "@/game-classes/Item";
import { Level } from "@/game-classes/Level";
import { TeleportReaction } from "@/game-classes/Reaction";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { Door, InteractableWallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { sprites as sharedSprites } from "@/instances/sprites";
import { doorway } from "@/instances/wallShapes";
import * as globalFeatures from "@/travels-in-generica/features";
import { Behaviour } from "@/game-classes/Behaviour";
import { Controller } from "@/game-classes/Controller";
import { FloorFeature, Pit } from "@/game-classes/FloorFeature";
import { Sky } from "@/game-classes/Sky";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";
import { CharacterStats } from "@/rpg-classes/CharacterStats";
import { Monster } from "@/rpg-classes/Monster";
import { itemTypes } from "./itemTypes";
import * as monsterDecisionFunctions from "./monsterBehaviour";
import { sprites } from "./sprites";

const bigSquareOnFloor: [number, number][] = [
    [-.45, -.45], [.45, -.45], [.45, .45], [-.45, .45]
]

const blueSquare = new FloorFeature({
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'blue' }, shape: bigSquareOnFloor
})

const redSquare = new FloorFeature({
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'red' }, shape: bigSquareOnFloor
})

const lever1 = new WallSwitch({ spriteId: sharedSprites.leverSprite.id, })
const door1 = new Door({ spriteId: sharedSprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: false })
const door2 = new Door({ spriteId: sharedSprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: false })
const doorOpenable1 = new Door({ spriteId: sharedSprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: true })
const doorOpenable2 = new Door({ spriteId: sharedSprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: true })

const teleportToCorner = new TeleportReaction({ x: 0, y: 0, direction: Direction.south })
const button1 = new InteractableWallFeature({ spriteId: sharedSprites.buttonSprite.id, reactions: [teleportToCorner] })

const pit1 = new Pit({});

const features = {
    staircaseAUp: globalFeatures.staircaseAUp,
    painting1: globalFeatures.painting1,
    lever1,
    door1,
    door2,
    doorOpenable1,
    doorOpenable2,
    button1,
    redSquare,
    blueSquare,
    pit1,
}

const level2: Level = new Level({
    height: 10, width: 12,
    features,
    sky: new Sky({ indoors: true, skyBaseColor: new Color(60, 60, 25) }),
    defaultWallPattern: sharedSprites.brickWall.id,
    floorColor: new Color(70, 70, 30),
    startingVantage: { x: 0, y: 5, direction: Direction.west },
    walls: [
        new Wall({ x: 0, y: 5, place: Direction.west, featureIds: ["staircaseAUp"] }),
        new Wall({ x: 0, y: 5, place: Direction.north }),
        new Wall({ x: 1, y: 5, place: Direction.north }),
        new Wall({ x: 2, y: 5, place: Direction.north }),
        new Wall({ x: 2, y: 5, place: Direction.east, featureIds: ["lever1"] }),
        new Wall({ x: 2, y: 6, place: Direction.east, shape: doorway, open: true, featureIds: ["door1"] }),
        new Wall({ x: 2, y: 7, place: Direction.east }),
        new Wall({ x: 2, y: 7, place: Direction.south }),
        new Wall({ x: 1, y: 7, place: Direction.south }),
        new Wall({ x: 0, y: 7, place: Direction.south }),

        new Wall({ x: 3, y: 6, place: Direction.south }),
        new Wall({ x: 3, y: 6, place: Direction.north }),
        new Wall({ x: 3, y: 6, place: Direction.east, shape: doorway, open: true }),
        new Wall({ x: 3, y: 5, place: Direction.east }),
        new Wall({ x: 3, y: 7, place: Direction.east }),
        new Wall({ x: 4, y: 5, place: Direction.north }),
        new Wall({ x: 5, y: 5, place: Direction.north, shape: doorway, open: true, featureIds: ["doorOpenable1"] }),
        new Wall({ x: 6, y: 5, place: Direction.north }),
        new Wall({ x: 6, y: 5, place: Direction.east }),
        new Wall({ x: 7, y: 6, place: Direction.north }),
        new Wall({ x: 7, y: 6, place: Direction.east, shape: doorway, open: true }),
        new Wall({ x: 7, y: 7, place: Direction.east, }),
        new Wall({ x: 7, y: 7, place: Direction.south, }),
        new Wall({ x: 6, y: 7, place: Direction.south, }),
        new Wall({ x: 5, y: 7, place: Direction.south, shape: doorway, open: true, featureIds: ["doorOpenable2"] }),
        new Wall({ x: 4, y: 7, place: Direction.south, }),

        new Wall({ x: 4, y: 4, place: Direction.west }),
        new Wall({ x: 4, y: 3, place: Direction.west }),
        new Wall({ x: 4, y: 3, place: Direction.north }),
        new Wall({ x: 5, y: 2, place: Direction.west }),
        new Wall({ x: 5, y: 2, place: Direction.east }),
        new Wall({ x: 5, y: 1, place: Direction.west }),
        new Wall({ x: 5, y: 1, place: Direction.north }),
        new Wall({ x: 5, y: 1, place: Direction.east }),
        new Wall({ x: 6, y: 3, place: Direction.north }),
        new Wall({ x: 6, y: 3, place: Direction.east }),
        new Wall({ x: 6, y: 4, place: Direction.east }),
        new Wall({ x: 7, y: 6, place: Direction.west, shape: doorway, open: true }),
        new Wall({ x: 7, y: 6, place: Direction.north }),
        new Wall({ x: 7, y: 6, place: Direction.south }),

        new Wall({ x: 3, y: 8, place: Direction.east }),
        new Wall({ x: 3, y: 9, place: Direction.east }),
        new Wall({ x: 6, y: 8, place: Direction.east }),
        new Wall({ x: 6, y: 9, place: Direction.east }),

        new Wall({ x: 8, y: 6, place: Direction.north, shape: doorway, open: true }),
        new Wall({ x: 8, y: 6, place: Direction.south, shape: doorway, open: true }),
        new Wall({ x: 9, y: 6, place: Direction.east, shape: doorway, open: true }),
        new Wall({ x: 9, y: 6, place: Direction.north, shape: doorway, open: true }),
        new Wall({ x: 9, y: 6, place: Direction.south, shape: doorway, open: true }),
        new Wall({ x: 10, y: 6, place: Direction.east, shape: doorway, open: true }),
        new Wall({ x: 10, y: 6, place: Direction.north, shape: doorway, open: true }),
        new Wall({ x: 10, y: 6, place: Direction.south, shape: doorway, open: true }),
        new Wall({ x: 11, y: 6, place: Direction.north, shape: doorway, open: true }),
        new Wall({ x: 11, y: 6, place: Direction.south, shape: doorway, open: true }),

        new Wall({ x: 7, y: 5, place: Direction.north }),
        new Wall({ x: 8, y: 5, place: Direction.north }),
        new Wall({ x: 9, y: 5, place: Direction.north }),
        new Wall({ x: 9, y: 2, place: Direction.east, featureIds: ["painting1"] }),
        new Wall({ x: 9, y: 3, place: Direction.east, shape: doorway, open: true, featureIds: ["door2"] }),
        new Wall({ x: 9, y: 4, place: Direction.east }),
        new Wall({ x: 10, y: 2, place: Direction.north }),
        new Wall({ x: 11, y: 2, place: Direction.north }),

        new Wall({ x: 9, y: 2, place: Direction.north }),
        new Wall({ x: 8, y: 2, place: Direction.north }),
        new Wall({ x: 7, y: 2, place: Direction.north }),
        new Wall({ x: 6, y: 2, place: Direction.north }),


    ],
    squaresWithFeatures: [

        new SquareWithFeatures({ x: 4, y: 3, direction: Direction.north, floorFeatureIds: ["blueSquare"], }),
        new SquareWithFeatures({ x: 6, y: 3, direction: Direction.north, floorFeatureIds: ["redSquare"], }),
        new SquareWithFeatures({ x: 5, y: 2, direction: Direction.north, floorFeatureIds: ["pit1"] }),


    ],
    actors: [
        new Monster({
            vantage: new Vantage({ x: 5.5, y: 6.5, direction: Direction.west }),
            spriteId: sprites.skeletonArcher.data.id,
            defaultAttackAnimation: "ATTACK_SWING",
            stats: new CharacterStats([1, 10], [10, 10]),
            behaviour: new Behaviour(monsterDecisionFunctions.standAndFight),
        }),

        new Monster({
            vantage: new Vantage({ x: 4.5, y: 8.5, direction: Direction.south }),
            spriteId: sprites.skeletonSpearman.data.id,
            stats: new CharacterStats([10, 10], [10, 10]),
            behaviour: new Behaviour(monsterDecisionFunctions.attackOrMoveClockwise),
        }),

        new Monster({
            vantage: new Vantage({ x: 6.5, y: 9.5, direction: Direction.north }),
            spriteId: sprites.skeletonSpearman.data.id,
            stats: new CharacterStats([10, 10], [10, 10]),
            behaviour: new Behaviour(monsterDecisionFunctions.attackOrMoveAntiClockwise),
        }),

    ],
    items: [
        Item.ofType(itemTypes.apple, { vantage: new Vantage({ x: 4.85, y: 4.4, direction: Direction.north }) }),
    ],
    controllers: [
        new Controller({
            inputIds: ["lever1"], subjectId: "door1", defaultSubjectState: "CLOSED", statusMap: [
                [["ON"], "OPEN"],
            ]
        }),
        new Controller({
            inputIds: ["blueSquare", "redSquare"], subjectId: "pit1", defaultSubjectState: "OPEN", useWeightAsStatusForFloorFeatures: true, statusMap: [
                [[FloorFeature.WEIGHED, FloorFeature.WEIGHED], "CLOSED"],
            ]
        }),
    ]
}).withWallsAround()



export { level2 };
