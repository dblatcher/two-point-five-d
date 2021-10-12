import { Color } from "@/canvas/Color";

import { FloorFeature } from "@/game-classes/FloorFeature";
import { Behaviour } from "@/game-classes/Behaviour";
import { SquareWithFeatures } from "@/game-classes/SquareWithFeatures";
import { Direction } from "@/game-classes/Direction";
import { Level } from "@/game-classes/Level";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { doorway, lowWall } from "../instances/wallShapes";
import { Controller } from "@/game-classes/Controller";
import { Item } from "@/game-classes/Item";


import { duck } from "@/duck-puzzle/figureFactory";
import { sprites } from "@/instances/sprites";

import * as itemTypes from "./itemTypes";
import { areAllDucksOnTheStar, blueStar, moveAntiClockwiseUnlessOnStar } from "./behaviours";
import { makeSign, lever1, door1, door2, floorSwitch, floorSwitch2, pit1, pitClosed } from "./features";


const hintForLevel1 = makeSign(["Help the duck", "reach the", "blue star!",])
const hintForLevel2 = makeSign(["Use both plates", "to open", "the door"])

const features = {
    lever1, door1, door2, floorSwitch, floorSwitch2, pit1, pitClosed, hintForLevel1, hintForLevel2, blueStar
}

const duckPuzzleLevel1 = new Level({
    height: 6,
    width: 8,
    startingVantage: {
        x: 1, y: 4, direction: Direction.north,
    },
    defaultWallPattern: sprites.brickWall,
    floorColor: new Color(100, 40, 40),
    features,
    walls: [
        new Wall({ x: 0, y: 3, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 1, y: 3, place: Direction.north, featureIds: ["hintForLevel1"] }),
        new Wall({ x: 2, y: 3, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 3, y: 3, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 4, y: 2, place: Direction.west, shape: doorway, open: true, featureIds: ["door1"] }),
        new Wall({ x: 4, y: 1, place: Direction.west, featureIds: ["lever1"] }),
        new Wall({ x: 4, y: 0, place: Direction.west }),
        new Wall({ x: 6, y: 0, place: Direction.west }),
        new Wall({ x: 6, y: 1, place: Direction.west }),
        new Wall({ x: 6, y: 1, place: Direction.south }),
        new Wall({ x: 6, y: 1, place: Direction.east }),
        new Wall({ x: 7, y: 0, place: Direction.south }),
    ],
    squaresWithFeatures: [
        new SquareWithFeatures({
            x: 7, y: 5, direction: Direction.north, floorFeatureIds: ["blueStar"]
        }),

        new SquareWithFeatures({
            x: 7, y: 2, direction: Direction.north, floorFeatureIds: ["pit1"]
        }),

        new SquareWithFeatures({
            x: 5, y: 2, direction: Direction.north, floorFeatureIds: ["floorSwitch"]
        }),

    ],
    actors: [
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar) }),
    ],
    items: [
    ],
    controllers: [
        new Controller({
            inputIds: ["lever1"], defaultSubjectState: "CLOSED", subjectId: "door1",
            statusMap: [[["ON"], "OPEN"]]
        }),

        new Controller({
            inputIds: ["floorSwitch"], subjectId: "pit1", defaultSubjectState: "OPEN", useWeightAsStatusForFloorFeatures: true, statusMap: [
                [[FloorFeature.WEIGHED], "CLOSED"],
            ]
        }),
    ],
    victoryCondition: areAllDucksOnTheStar,
    victoryMessage: "Well done! But there are more ducks who need your help..."
}).withWallsAround()

const duckPuzzleLevel2 = new Level({
    height: 6,
    width: 6,
    features,
    startingVantage: {
        x: 1, y: 2, direction: Direction.east,
    },
    // defaultWallPattern: sprites.brickWall,
    floorColor: new Color(30, 120, 90),
    walls: [
        new Wall({ x: 5, y: 2, place: Direction.north, shape: lowWall, }),
        new Wall({ x: 5, y: 2, place: Direction.south, shape: lowWall, }),
        new Wall({ x: 5, y: 3, place: Direction.east, featureIds: ["hintForLevel2"] }),
        new Wall({ x: 4, y: 2, place: Direction.north, shape: lowWall, }),
        new Wall({ x: 4, y: 2, place: Direction.south, shape: lowWall, }),
        new Wall({ x: 4, y: 2, place: Direction.west, featureIds: ["door1"], open: true, shape: doorway }),
    ],
    squaresWithFeatures: [
        new SquareWithFeatures({
            x: 1, y: 2, direction: Direction.north, floorFeatureIds: ["blueStar"]
        }),

        new SquareWithFeatures({
            x: 3, y: 1, direction: Direction.north, floorFeatureIds: ["floorSwitch2"]
        }),

        new SquareWithFeatures({
            x: 3, y: 3, direction: Direction.north, floorFeatureIds: ["floorSwitch"]
        }),

    ],
    actors: [
        duck({ x: 5.5, y: 2.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar) }),
    ],
    items: [
        new Item({
            type: itemTypes.weight, vantage: new Vantage({ x: 4.5, y: 3.75, direction: Direction.north })
        }),
    ],
    controllers: [
        new Controller({
            inputIds: ["floorSwitch", "floorSwitch2"], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subjectId: "door1",
            statusMap: [[[FloorFeature.WEIGHED, FloorFeature.WEIGHED], "OPEN"]]
        }),
    ],
    victoryCondition: areAllDucksOnTheStar,
    victoryMessage: "You're getting the hang of this!"
}).withWallsAround()

const duckPuzzleLevel3 = new Level({
    height: 7,
    width: 7,
    features,
    startingVantage: {
        x: 0, y: 0, direction: Direction.east,
    },
    floorColor: new Color(120, 90, 30),
    walls: [

        new Wall({ x: 2, y: 2, place: Direction.north, }),
        new Wall({ x: 3, y: 2, place: Direction.north, shape: doorway, open: true, featureIds: ["door1"] }),
        new Wall({ x: 4, y: 2, place: Direction.north, }),

        new Wall({ x: 2, y: 4, place: Direction.south, }),
        new Wall({ x: 3, y: 4, place: Direction.south, shape: doorway, open: true, featureIds: ["door2"] }),
        new Wall({ x: 4, y: 4, place: Direction.south, }),

        new Wall({ x: 2, y: 2, place: Direction.west, }),
        new Wall({ x: 2, y: 3, place: Direction.west, featureIds: ["lever1"] }),
        new Wall({ x: 2, y: 4, place: Direction.west, }),

        new Wall({ x: 4, y: 2, place: Direction.east, }),
        new Wall({ x: 4, y: 3, place: Direction.east, }),
        new Wall({ x: 4, y: 4, place: Direction.east, }),

        new Wall({ x: 4, y: 6, place: Direction.west, shape: doorway, open: true, featureIds: ["door1"] }),
    ],
    squaresWithFeatures: [
        new SquareWithFeatures({
            x: 3, y: 3, direction: Direction.north, floorFeatureIds: ["blueStar"]
        }),

        new SquareWithFeatures({
            x: 4, y: 0, direction: Direction.north, floorFeatureIds: ["pitClosed"]
        }),

        new SquareWithFeatures({
            x: 3, y: 0, direction: Direction.north, floorFeatureIds: ["floorSwitch"]
        }),
    ],
    actors: [
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar) }),
        duck({ x: 0.5, y: 3.5, direction: Direction.north, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar) }),
    ],
    items: [

    ],
    controllers: [
        new Controller({
            inputIds: ["floorSwitch"], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subjectId: "pitClosed",
            statusMap: [[[FloorFeature.WEIGHED], "OPEN"]]
        }),
        new Controller({
            inputIds: ["floorSwitch"], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subjectId: "door1",
            statusMap: [[[FloorFeature.WEIGHED], "OPEN"]]
        }),
        new Controller({
            inputIds: ["lever1"], defaultSubjectState: "CLOSED", subjectId: "door2",
            statusMap: [[["ON"], "OPEN"]]
        }),
    ],
    victoryCondition: areAllDucksOnTheStar,
    victoryMessage: "Something something ducks!"
}).withWallsAround()

export { duckPuzzleLevel1, duckPuzzleLevel2, duckPuzzleLevel3 }