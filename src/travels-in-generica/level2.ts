import { putWallsAroundLevel } from "@/game-classes/constructionHelpers";
import { FloorFeature, FloorFeatureInput, PitInput } from "@/game-classes/FloorFeature";
import { sprites as sharedSprites } from "@/instances/sprites";
import { doorway } from "@/instances/wallShapes";
import * as globalFeatures from "@/travels-in-generica/features";
import { itemTypes } from "./itemTypes";
import { sprites } from "./sprites";
import { WallFeatureInput } from "@/game-classes/WallFeature";

const bigSquareOnFloor: [number, number][] = [
    [-.45, -.45], [.45, -.45], [.45, .45], [-.45, .45]
]

const blueSquare: FloorFeatureInput = {
    featureType: 'FloorFeature',
    blocksByDefault: false,
    shapes: [
        { plotConfig: { noFill: false, fillStyle: 'blue' }, shape: bigSquareOnFloor }
    ]
}

const redSquare: FloorFeatureInput = {
    featureType: 'FloorFeature',
    blocksByDefault: false,
    shapes: [
        { plotConfig: { noFill: false, fillStyle: 'red' }, shape: bigSquareOnFloor }
    ]
}

const lever1 = ({ featureType: 'WallSwitch', spriteId: sharedSprites.leverSprite.id, })
const door1 = ({ featureType: 'Door', spriteId: sharedSprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: false })
const door2 = ({ featureType: 'Door', spriteId: sharedSprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: false })
const doorOpenable1 = ({ featureType: 'Door', spriteId: sharedSprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: true })
const doorOpenable2 = ({ featureType: 'Door', spriteId: sharedSprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: true })

const button1: WallFeatureInput = ({
    featureType: 'WallFeature',
    spriteId: sharedSprites.buttonSprite.id,
    interactable: true,
    reactions: [
        { reactionType: 'TELEPORT', destination: { x: 0, y: 0, direction: 'SOUTH' } }
    ]
})

const pit1: PitInput = { featureType: 'Pit', status: 'OPEN' };

const level2 = putWallsAroundLevel({
    id: 'level2',
    height: 10, width: 12,
    features: {
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
    },
    sky: { indoors: true, skyBaseColor: [60, 60, 25] },
    defaultWallPattern: sharedSprites.brickWall.id,
    floorColor: [70, 70, 30],
    startingVantage: [0, 5, 'WEST'],
    walls: [
        { place: [0, 5, 'WEST'], featureIds: ["staircaseAUp"] },
        { place: [0, 5, 'NORTH'] },
        { place: [1, 5, 'NORTH'] },
        { place: [2, 5, 'NORTH'] },
        { place: [2, 5, 'EAST'], featureIds: ["lever1"] },
        { place: [2, 6, 'EAST'], shape: doorway, open: true, featureIds: ["door1"] },
        { place: [2, 7, 'EAST'] },
        { place: [2, 7, 'SOUTH'] },
        { place: [1, 7, 'SOUTH'] },
        { place: [0, 7, 'SOUTH'] },

        { place: [3, 6, 'SOUTH'] },
        { place: [3, 6, 'NORTH'] },
        { place: [3, 6, 'EAST'], shape: doorway, open: true },
        { place: [3, 5, 'EAST'] },
        { place: [3, 7, 'EAST'] },
        { place: [4, 5, 'NORTH'] },
        { place: [5, 5, 'NORTH'], shape: doorway, open: true, featureIds: ["doorOpenable1"] },
        { place: [6, 5, 'NORTH'] },
        { place: [6, 5, 'EAST'] },
        { place: [7, 6, 'NORTH'] },
        { place: [7, 6, 'EAST'], shape: doorway, open: true },
        { place: [7, 7, 'EAST'], },
        { place: [7, 7, 'SOUTH'], },
        { place: [6, 7, 'SOUTH'], },
        { place: [5, 7, 'SOUTH'], shape: doorway, open: true, featureIds: ["doorOpenable2"] },
        { place: [4, 7, 'SOUTH'], },

        { place: [4, 4, 'WEST'] },
        { place: [4, 3, 'WEST'] },
        { place: [4, 3, 'NORTH'] },
        { place: [5, 2, 'WEST'] },
        { place: [5, 2, 'EAST'] },
        { place: [5, 1, 'WEST'] },
        { place: [5, 1, 'NORTH'] },
        { place: [5, 1, 'EAST'] },
        { place: [6, 3, 'NORTH'] },
        { place: [6, 3, 'EAST'] },
        { place: [6, 4, 'EAST'] },
        { place: [7, 6, 'WEST'], shape: doorway, open: true },
        { place: [7, 6, 'NORTH'] },
        { place: [7, 6, 'SOUTH'] },

        { place: [3, 8, 'EAST'] },
        { place: [3, 9, 'EAST'] },
        { place: [6, 8, 'EAST'] },
        { place: [6, 9, 'EAST'] },

        { place: [8, 6, 'NORTH'], shape: doorway, open: true },
        { place: [8, 6, 'SOUTH'], shape: doorway, open: true },
        { place: [9, 6, 'EAST'], shape: doorway, open: true },
        { place: [9, 6, 'NORTH'], shape: doorway, open: true },
        { place: [9, 6, 'SOUTH'], shape: doorway, open: true },
        { place: [10, 6, 'EAST'], shape: doorway, open: true },
        { place: [10, 6, 'NORTH'], shape: doorway, open: true },
        { place: [10, 6, 'SOUTH'], shape: doorway, open: true },
        { place: [11, 6, 'NORTH'], shape: doorway, open: true },
        { place: [11, 6, 'SOUTH'], shape: doorway, open: true },

        { place: [7, 5, 'NORTH'] },
        { place: [8, 5, 'NORTH'] },
        { place: [9, 5, 'NORTH'] },
        { place: [9, 2, 'EAST'], featureIds: ["painting1"] },
        { place: [9, 3, 'EAST'], shape: doorway, open: true, featureIds: ["door2"] },
        { place: [9, 4, 'EAST'] },
        { place: [10, 2, 'NORTH'] },
        { place: [11, 2, 'NORTH'] },

        { place: [9, 2, 'NORTH'] },
        { place: [8, 2, 'NORTH'] },
        { place: [7, 2, 'NORTH'] },
        { place: [6, 2, 'NORTH'] },

    ],
    squaresWithFeatures: [
        { x: 4, y: 3, direction: 'NORTH', floorFeatureIds: ["blueSquare"], },
        { x: 6, y: 3, direction: 'NORTH', floorFeatureIds: ["redSquare"], },
        { x: 5, y: 2, direction: 'NORTH', floorFeatureIds: ["pit1"] },
    ],
    actors: [
        {
            actorType: 'Monster',
            vantage: [5.5, 6.5, 'WEST'],
            sprite: sprites.skeletonArcher.data.id,
            defaultAttackAnimation: "ATTACK_SWING",
            stats: ({ health: [1, 10], stamina: [10, 10], mana: [0, 0] }),
            behaviour: 'standAndFight',
        },

        {
            actorType: 'Monster',
            vantage: [4.5, 8.5, 'SOUTH'],
            sprite: sprites.skeletonSpearman.data.id,
            stats: ({ health: [10, 10], stamina: [10, 10], mana: [0, 0] }),
            behaviour: 'attackOrMoveClockwise',
        },
        {
            actorType: 'Monster',
            vantage: [6.5, 9.5, 'NORTH'],
            sprite: sprites.skeletonSpearman.data.id,
            stats: ({ health: [10, 10], stamina: [10, 10], mana: [0, 0] }),
            behaviour: 'attackOrMoveAntiClockwise',
        },

    ],
    items: [
        { vantage: [4.85, 4.4, 'NORTH'], type: itemTypes.apple.id },
    ],
    controllers: [
        ({
            subjectId: "door1",
            inputIds: ["lever1"],
            defaultSubjectState: "CLOSED",
            statusMap: [
                [["ON"], "OPEN"],
            ]
        }),
        ({
            subjectId: "pit1",
            inputIds: ["blueSquare", "redSquare"],
            useWeightAsStatusForFloorFeatures: true,
            defaultSubjectState: "OPEN",
            statusMap: [
                [[FloorFeature.WEIGHED, FloorFeature.WEIGHED], "CLOSED"],
            ]
        }),
    ]
})



export { level2 };

