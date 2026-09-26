import { duck } from "@/duck-puzzle/figureFactory";
import { putWallsAroundLevel } from "@/game-classes/constructionHelpers";
import { Direction } from "@/game-classes/Direction";
import { FloorFeature } from "@/game-classes/FloorFeature";
import { sprites } from "@/instances/sprites";
import { doorway, lowWall } from "../instances/wallShapes";
import { blueStar } from "./behaviours";
import { door1, door2, floorSwitch, floorSwitch2, lever1, makeSign, pit1, pitClosed, shapeOnWall } from "./features";
import { itemTypes } from "./itemTypes";


const hintForLevel1 = makeSign(["Help the duck", "reach the", "blue star!",])
const hintForLevel2 = makeSign(["Use both plates", "to open", "the door"])

const duckPuzzleFeatures = {
    lever1, door1, door2, floorSwitch, floorSwitch2, pit1, pitClosed, hintForLevel1, hintForLevel2, blueStar, shapeOnWall
}

const duckPuzzleLevel1 = putWallsAroundLevel({
    id: "duckPuzzleLevel1",
    height: 6,
    width: 8,
    startingVantage: [1, 4, 'NORTH'],
    defaultWallPattern: sprites.brickWall.id,
    floorColor: [100, 40, 40],
    features: duckPuzzleFeatures,
    walls: [
        { place: [0, 3, 'NORTH'], patternSprite: sprites.windowWall.id },
        { place: [1, 3, 'NORTH'], featureIds: ["hintForLevel1"] },
        { place: [2, 3, 'NORTH'], patternSprite: sprites.windowWall.id },
        { place: [3, 3, 'NORTH'], patternSprite: sprites.windowWall.id },
        { place: [4, 2, 'WEST'], shape: doorway, open: true, featureIds: ["door1"] },
        { place: [4, 1, 'WEST'], featureIds: ["lever1"] },
        { place: [4, 0, 'WEST'] },
        { place: [6, 0, 'WEST'] },
        { place: [6, 1, 'WEST'] },
        { place: [6, 1, 'SOUTH'] },
        { place: [6, 1, 'EAST'] },
        { place: [7, 0, 'SOUTH'] },
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
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: 'moveAntiClockwiseUnlessOnStar' }),
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
    victoryCondition: 'areAllDucksOnTheStar',
    victoryMessage: "Well done! But there are more ducks who need your help..."
})

const duckPuzzleLevel2 = putWallsAroundLevel({
    id: 'duckPuzzleLevel2',
    height: 6,
    width: 6,
    features: duckPuzzleFeatures,
    startingVantage: [1, 2, 'EAST'],
    floorColor: [30, 120, 90],
    walls: [
        { place: [5, 2, 'NORTH'], shape: lowWall, },
        { place: [5, 2, 'SOUTH'], shape: lowWall, },
        { place: [5, 3, 'EAST'], featureIds: ["hintForLevel2"] },
        { place: [4, 2, 'NORTH'], shape: lowWall, },
        { place: [4, 2, 'SOUTH'], shape: lowWall, },
        { place: [4, 2, 'WEST'], featureIds: ["door1"], open: true, shape: doorway },
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
        duck({ x: 5.5, y: 2.5, direction: Direction.east, behaviour: 'moveAntiClockwiseUnlessOnStar' }),
    ],
    items: [
        {
            type: itemTypes.weight.id,
            vantage: [4.5, 3.75, 'NORTH'],
        },
    ],
    controllers: [
        ({
            inputIds: ["floorSwitch", "floorSwitch2"], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subjectId: "door1",
            statusMap: [[[FloorFeature.WEIGHED, FloorFeature.WEIGHED], "OPEN"]]
        }),
    ],
    victoryCondition: 'areAllDucksOnTheStar',
    victoryMessage: "You're getting the hang of this!"
});

const duckPuzzleLevel3 = putWallsAroundLevel({
    id: 'duckPuzzleLevel3',
    height: 7,
    width: 7,
    features: duckPuzzleFeatures,
    startingVantage: [0, 0, 'EAST'],
    floorColor: [120, 90, 30],
    walls: [
        { place: [2, 2, 'NORTH'], },
        { place: [3, 2, 'NORTH'], shape: doorway, open: true, featureIds: ["door1"] },
        { place: [4, 2, 'NORTH'], },

        { place: [2, 4, 'SOUTH'], },
        { place: [3, 4, 'SOUTH'], shape: doorway, open: true, featureIds: ["door2"] },
        { place: [4, 4, 'SOUTH'], },

        { place: [2, 2, 'WEST'], },
        { place: [2, 3, 'WEST'], featureIds: ["lever1"] },
        { place: [2, 4, 'WEST'], },

        { place: [4, 2, 'EAST'], },
        { place: [4, 3, 'EAST'], },
        { place: [4, 4, 'EAST'], },

        { place: [4, 6, 'WEST'], shape: doorway, open: true, featureIds: ["door1"] },
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
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: 'moveAntiClockwiseUnlessOnStar' }),
        duck({ x: 0.5, y: 3.5, direction: Direction.north, behaviour: 'moveAntiClockwiseUnlessOnStar' }),
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
    victoryCondition: 'areAllDucksOnTheStar',
    victoryMessage: "Something something ducks!"
})

export { duckPuzzleLevel1, duckPuzzleLevel2, duckPuzzleLevel3 };

