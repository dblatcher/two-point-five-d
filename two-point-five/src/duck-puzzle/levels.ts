import { duck } from "@/duck-puzzle/figureFactory";
import { Behaviour } from "@/game-classes/Behaviour";
import { putWallsAroundLevel } from "@/game-classes/constructionHelpers";
import { Direction } from "@/game-classes/Direction";
import { FloorFeature } from "@/game-classes/FloorFeature";
import { sprites } from "@/instances/sprites";
import { doorway, lowWall } from "../instances/wallShapes";
import { areAllDucksOnTheStar, blueStar, moveAntiClockwiseUnlessOnStar } from "./behaviours";
import { door1, door2, floorSwitch, floorSwitch2, lever1, makeSign, pit1, pitClosed } from "./features";
import { itemTypes } from "./itemTypes";


const hintForLevel1 = makeSign(["Help the duck", "reach the", "blue star!",])
const hintForLevel2 = makeSign(["Use both plates", "to open", "the door"])

const features = {
    lever1, door1, door2, floorSwitch, floorSwitch2, pit1, pitClosed, hintForLevel1, hintForLevel2, blueStar
}

const duckPuzzleLevel1 = putWallsAroundLevel({
    id: "duckPuzzleLevel1",
    height: 6,
    width: 8,
    startingVantage: {
        x: 1, y: 4, direction: 'NORTH',
    },
    defaultWallPattern: sprites.brickWall.id,
    floorColor: [100, 40, 40],
    features,
    walls: [
        ({ x: 0, y: 3, placeName: 'NORTH', patternSprite: sprites.windowWall.id }),
        ({ x: 1, y: 3, placeName: 'NORTH', featureIds: ["hintForLevel1"] }),
        ({ x: 2, y: 3, placeName: 'NORTH', patternSprite: sprites.windowWall.id }),
        ({ x: 3, y: 3, placeName: 'NORTH', patternSprite: sprites.windowWall.id }),
        ({ x: 4, y: 2, placeName: 'WEST', shape: doorway, open: true, featureIds: ["door1"] }),
        ({ x: 4, y: 1, placeName: 'WEST', featureIds: ["lever1"] }),
        ({ x: 4, y: 0, placeName: 'WEST' }),
        ({ x: 6, y: 0, placeName: 'WEST' }),
        ({ x: 6, y: 1, placeName: 'WEST' }),
        ({ x: 6, y: 1, placeName: 'SOUTH' }),
        ({ x: 6, y: 1, placeName: 'EAST' }),
        ({ x: 7, y: 0, placeName: 'SOUTH' }),
    ],
    squaresWithFeatures: [
        {
            x: 7, y: 5, direction: 'NORTH', floorFeatureIds: ["blueStar"]
        },

        {
            x: 7, y: 2, direction: 'NORTH', floorFeatureIds: ["pit1"]
        },

        {
            x: 5, y: 2, direction: 'NORTH', floorFeatureIds: ["floorSwitch"]
        },

    ],
    actors: [
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar) }),
    ],
    items: [
    ],
    controllers: [
        ({
            inputIds: ["lever1"], defaultSubjectState: "CLOSED", subjectId: "door1",
            statusMap: [[["ON"], "OPEN"]]
        }),

        ({
            inputIds: ["floorSwitch"], subjectId: "pit1", defaultSubjectState: "OPEN", useWeightAsStatusForFloorFeatures: true, statusMap: [
                [[FloorFeature.WEIGHED], "CLOSED"],
            ]
        }),
    ],
    victoryCondition: areAllDucksOnTheStar,
    victoryMessage: "Well done! But there are more ducks who need your help..."
})

const duckPuzzleLevel2 = putWallsAroundLevel({
    id: 'duckPuzzleLevel2',
    height: 6,
    width: 6,
    features,
    startingVantage: {
        x: 1, y: 2, direction: 'EAST',
    },
    floorColor: [30, 120, 90],
    walls: [
        ({ x: 5, y: 2, placeName: 'NORTH', shape: lowWall, }),
        ({ x: 5, y: 2, placeName: 'SOUTH', shape: lowWall, }),
        ({ x: 5, y: 3, placeName: 'EAST', featureIds: ["hintForLevel2"] }),
        ({ x: 4, y: 2, placeName: 'NORTH', shape: lowWall, }),
        ({ x: 4, y: 2, placeName: 'SOUTH', shape: lowWall, }),
        ({ x: 4, y: 2, placeName: 'WEST', featureIds: ["door1"], open: true, shape: doorway }),
    ],
    squaresWithFeatures: [
        {
            x: 1, y: 2, direction: 'NORTH', floorFeatureIds: ["blueStar"]
        },

        {
            x: 3, y: 1, direction: 'NORTH', floorFeatureIds: ["floorSwitch2"]
        },

        {
            x: 3, y: 3, direction: 'NORTH', floorFeatureIds: ["floorSwitch"]
        },

    ],
    actors: [
        duck({ x: 5.5, y: 2.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar) }),
    ],
    items: [
        {
            type: itemTypes.weight.id,
            vantage: { x: 4.5, y: 3.75, direction: 'NORTH' }
        },
    ],
    controllers: [
        ({
            inputIds: ["floorSwitch", "floorSwitch2"], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subjectId: "door1",
            statusMap: [[[FloorFeature.WEIGHED, FloorFeature.WEIGHED], "OPEN"]]
        }),
    ],
    victoryCondition: areAllDucksOnTheStar,
    victoryMessage: "You're getting the hang of this!"
});

const duckPuzzleLevel3 = putWallsAroundLevel({
    id: 'duckPuzzleLevel3',
    height: 7,
    width: 7,
    features,
    startingVantage: {
        x: 0, y: 0, direction: 'EAST',
    },
    floorColor: [120, 90, 30],
    walls: [
        ({ x: 2, y: 2, placeName: 'NORTH', }),
        ({ x: 3, y: 2, placeName: 'NORTH', shape: doorway, open: true, featureIds: ["door1"] }),
        ({ x: 4, y: 2, placeName: 'NORTH', }),

        ({ x: 2, y: 4, placeName: 'SOUTH', }),
        ({ x: 3, y: 4, placeName: 'SOUTH', shape: doorway, open: true, featureIds: ["door2"] }),
        ({ x: 4, y: 4, placeName: 'SOUTH', }),

        ({ x: 2, y: 2, placeName: 'WEST', }),
        ({ x: 2, y: 3, placeName: 'WEST', featureIds: ["lever1"] }),
        ({ x: 2, y: 4, placeName: 'WEST', }),

        ({ x: 4, y: 2, placeName: 'EAST', }),
        ({ x: 4, y: 3, placeName: 'EAST', }),
        ({ x: 4, y: 4, placeName: 'EAST', }),

        ({ x: 4, y: 6, placeName: 'WEST', shape: doorway, open: true, featureIds: ["door1"] }),
    ],
    squaresWithFeatures: [
        {
            x: 3, y: 3, direction: 'NORTH', floorFeatureIds: ["blueStar"]
        },

        {
            x: 4, y: 0, direction: 'NORTH', floorFeatureIds: ["pitClosed"]
        },

        {
            x: 3, y: 0, direction: 'NORTH', floorFeatureIds: ["floorSwitch"]
        },
    ],
    actors: [
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar) }),
        duck({ x: 0.5, y: 3.5, direction: Direction.north, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar) }),
    ],
    items: [

    ],
    controllers: [
        ({
            inputIds: ["floorSwitch"], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subjectId: "pitClosed",
            statusMap: [[[FloorFeature.WEIGHED], "OPEN"]]
        }),
        ({
            inputIds: ["floorSwitch"], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subjectId: "door1",
            statusMap: [[[FloorFeature.WEIGHED], "OPEN"]]
        }),
        ({
            inputIds: ["lever1"], defaultSubjectState: "CLOSED", subjectId: "door2",
            statusMap: [[["ON"], "OPEN"]]
        }),
    ],
    victoryCondition: areAllDucksOnTheStar,
    victoryMessage: "Something something ducks!"
})

export { duckPuzzleLevel1, duckPuzzleLevel2, duckPuzzleLevel3 };

