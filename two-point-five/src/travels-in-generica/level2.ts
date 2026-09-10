import { putWallsAroundLevel } from "@/game-classes/constructionHelpers";
import { FloorFeature, Pit } from "@/game-classes/FloorFeature";
import { TeleportReaction } from "@/game-classes/Reaction";
import { Vantage } from "@/game-classes/Vantage";
import { Door, InteractableWallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { sprites as sharedSprites } from "@/instances/sprites";
import { doorway } from "@/instances/wallShapes";
import { CharacterStats } from "@/rpg-classes/CharacterStats";
import * as globalFeatures from "@/travels-in-generica/features";
import { itemTypes } from "./itemTypes";
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

const teleportToCorner = new TeleportReaction({ x: 0, y: 0, direction: 'SOUTH' })
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

const level2 = putWallsAroundLevel({
    id: 'level2',
    height: 10, width: 12,
    features,
    sky: { indoors: true, skyBaseColor: [60, 60, 25] },
    defaultWallPattern: sharedSprites.brickWall.id,
    floorColor: [70, 70, 30],
    startingVantage: { x: 0, y: 5, direction: 'WEST' },
    walls: [
        ({ x: 0, y: 5, placeName: 'WEST', featureIds: ["staircaseAUp"] }),
        ({ x: 0, y: 5, placeName: 'NORTH' }),
        ({ x: 1, y: 5, placeName: 'NORTH' }),
        ({ x: 2, y: 5, placeName: 'NORTH' }),
        ({ x: 2, y: 5, placeName: 'EAST', featureIds: ["lever1"] }),
        ({ x: 2, y: 6, placeName: 'EAST', shape: doorway, open: true, featureIds: ["door1"] }),
        ({ x: 2, y: 7, placeName: 'EAST' }),
        ({ x: 2, y: 7, placeName: 'SOUTH' }),
        ({ x: 1, y: 7, placeName: 'SOUTH' }),
        ({ x: 0, y: 7, placeName: 'SOUTH' }),

        ({ x: 3, y: 6, placeName: 'SOUTH' }),
        ({ x: 3, y: 6, placeName: 'NORTH' }),
        ({ x: 3, y: 6, placeName: 'EAST', shape: doorway, open: true }),
        ({ x: 3, y: 5, placeName: 'EAST' }),
        ({ x: 3, y: 7, placeName: 'EAST' }),
        ({ x: 4, y: 5, placeName: 'NORTH' }),
        ({ x: 5, y: 5, placeName: 'NORTH', shape: doorway, open: true, featureIds: ["doorOpenable1"] }),
        ({ x: 6, y: 5, placeName: 'NORTH' }),
        ({ x: 6, y: 5, placeName: 'EAST' }),
        ({ x: 7, y: 6, placeName: 'NORTH' }),
        ({ x: 7, y: 6, placeName: 'EAST', shape: doorway, open: true }),
        ({ x: 7, y: 7, placeName: 'EAST', }),
        ({ x: 7, y: 7, placeName: 'SOUTH', }),
        ({ x: 6, y: 7, placeName: 'SOUTH', }),
        ({ x: 5, y: 7, placeName: 'SOUTH', shape: doorway, open: true, featureIds: ["doorOpenable2"] }),
        ({ x: 4, y: 7, placeName: 'SOUTH', }),

        ({ x: 4, y: 4, placeName: 'WEST' }),
        ({ x: 4, y: 3, placeName: 'WEST' }),
        ({ x: 4, y: 3, placeName: 'NORTH' }),
        ({ x: 5, y: 2, placeName: 'WEST' }),
        ({ x: 5, y: 2, placeName: 'EAST' }),
        ({ x: 5, y: 1, placeName: 'WEST' }),
        ({ x: 5, y: 1, placeName: 'NORTH' }),
        ({ x: 5, y: 1, placeName: 'EAST' }),
        ({ x: 6, y: 3, placeName: 'NORTH' }),
        ({ x: 6, y: 3, placeName: 'EAST' }),
        ({ x: 6, y: 4, placeName: 'EAST' }),
        ({ x: 7, y: 6, placeName: 'WEST', shape: doorway, open: true }),
        ({ x: 7, y: 6, placeName: 'NORTH' }),
        ({ x: 7, y: 6, placeName: 'SOUTH' }),

        ({ x: 3, y: 8, placeName: 'EAST' }),
        ({ x: 3, y: 9, placeName: 'EAST' }),
        ({ x: 6, y: 8, placeName: 'EAST' }),
        ({ x: 6, y: 9, placeName: 'EAST' }),

        ({ x: 8, y: 6, placeName: 'NORTH', shape: doorway, open: true }),
        ({ x: 8, y: 6, placeName: 'SOUTH', shape: doorway, open: true }),
        ({ x: 9, y: 6, placeName: 'EAST', shape: doorway, open: true }),
        ({ x: 9, y: 6, placeName: 'NORTH', shape: doorway, open: true }),
        ({ x: 9, y: 6, placeName: 'SOUTH', shape: doorway, open: true }),
        ({ x: 10, y: 6, placeName: 'EAST', shape: doorway, open: true }),
        ({ x: 10, y: 6, placeName: 'NORTH', shape: doorway, open: true }),
        ({ x: 10, y: 6, placeName: 'SOUTH', shape: doorway, open: true }),
        ({ x: 11, y: 6, placeName: 'NORTH', shape: doorway, open: true }),
        ({ x: 11, y: 6, placeName: 'SOUTH', shape: doorway, open: true }),

        ({ x: 7, y: 5, placeName: 'NORTH' }),
        ({ x: 8, y: 5, placeName: 'NORTH' }),
        ({ x: 9, y: 5, placeName: 'NORTH' }),
        ({ x: 9, y: 2, placeName: 'EAST', featureIds: ["painting1"] }),
        ({ x: 9, y: 3, placeName: 'EAST', shape: doorway, open: true, featureIds: ["door2"] }),
        ({ x: 9, y: 4, placeName: 'EAST' }),
        ({ x: 10, y: 2, placeName: 'NORTH' }),
        ({ x: 11, y: 2, placeName: 'NORTH' }),

        ({ x: 9, y: 2, placeName: 'NORTH' }),
        ({ x: 8, y: 2, placeName: 'NORTH' }),
        ({ x: 7, y: 2, placeName: 'NORTH' }),
        ({ x: 6, y: 2, placeName: 'NORTH' }),


    ],
    squaresWithFeatures: [
        { x: 4, y: 3, direction: 'NORTH', floorFeatureIds: ["blueSquare"], },
        { x: 6, y: 3, direction: 'NORTH', floorFeatureIds: ["redSquare"], },
        { x: 5, y: 2, direction: 'NORTH', floorFeatureIds: ["pit1"] },
    ],
    actors: [
        {
            actorType: 'Monster',
            vantage: new Vantage({ x: 5.5, y: 6.5, direction: 'WEST' }),
            sprite: sprites.skeletonArcher.data.id,
            defaultAttackAnimation: "ATTACK_SWING",
            stats: new CharacterStats({ health: [1, 10], stamina: [10, 10], mana: [0, 0] }),
            behaviour: 'standAndFight',
        },

        {
            actorType: 'Monster',
            vantage: new Vantage({ x: 4.5, y: 8.5, direction: 'SOUTH' }),
            sprite: sprites.skeletonSpearman.data.id,
            stats: new CharacterStats({ health: [10, 10], stamina: [10, 10], mana: [0, 0] }),
            behaviour: 'attackOrMoveClockwise',
        },
        {
            actorType: 'Monster',
            vantage: new Vantage({ x: 6.5, y: 9.5, direction: 'NORTH' }),
            sprite: sprites.skeletonSpearman.data.id,
            stats: new CharacterStats({ health: [10, 10], stamina: [10, 10], mana: [0, 0] }),
            behaviour: 'attackOrMoveAntiClockwise',
        },

    ],
    items: [
        { vantage: { x: 4.85, y: 4.4, direction: 'NORTH' }, type: itemTypes.apple.id },
    ],
    controllers: [
        ({
            inputIds: ["lever1"], subjectId: "door1", defaultSubjectState: "CLOSED", statusMap: [
                [["ON"], "OPEN"],
            ]
        }),
        ({
            inputIds: ["blueSquare", "redSquare"], subjectId: "pit1", defaultSubjectState: "OPEN", useWeightAsStatusForFloorFeatures: true, statusMap: [
                [[FloorFeature.WEIGHED, FloorFeature.WEIGHED], "CLOSED"],
            ]
        }),
    ]
})



export { level2 };

