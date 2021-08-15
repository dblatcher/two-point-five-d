import { TextBoard } from "@/canvas/TextBoard"
import { Color } from "@/canvas/Color";

import { Door, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { FloorFeature, Pit } from "@/game-classes/FloorFeature";
import { Action, MovementAction, MovementByAction } from "@/game-classes/Action";
import { Behaviour } from "@/game-classes/Behaviour";
import { Figure } from "@/game-classes/Figure";
import { Game } from "@/game-classes/Game";
import { RelativeDirection } from "@/game-classes/RelativeDirection";
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

import { sprites as mySprites} from "./sprites";
import * as itemTypes  from "./itemTypes";


function makeSign(text: string[]): WallFeature {
    return new WallFeature({
        clipToWall: true,
        textBoard: new TextBoard({
            content: text,
            size: { x: .8, y: .5 },
            textScale: 3.5,
            font: 'arial',
            textColor: Color.BLUE,
            backgroundColor: Color.YELLOW,
        }),
    })
}


const hintForLevel1 = makeSign(["Help the duck", "reach the", "blue star!",])
const hintForLevel2 = makeSign(["Use both plates", "to open", "the door"])

const lever1 = new WallSwitch({ sprite: sprites.leverSprite, })
const door1 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const door2 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })


const bigSquareOnFloor: [number, number][] = [
    [-.4, -.4], [.4, -.4], [.4, .4], [-.4, .4]
]

const starOnFloor: [number, number][] = [
    [0, 0.5],
    [0.1, 0.1],
    [0.5, 0],
    [0.1, -0.1],
    [0, -0.5],
    [-0.1, -0.1],
    [-0.5, 0],
    [-0.1, 0.1],
]


const blueStar = new FloorFeature({
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'blue' }, shape: starOnFloor
})

const floorSwitch = new FloorFeature({
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'gray' }, shape: bigSquareOnFloor
})
const floorSwitch2 = new FloorFeature({
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'gray' }, shape: bigSquareOnFloor
})

const pit1 = new Pit({ status: "OPEN" })
const pitClosed = new Pit({ status: "CLOSED" })



function moveAntiClockwiseUnlessOnStar(actor: Figure, game: Game, behaviour: Behaviour): Action {

    const squareWithStar = game.data.level.data.contents
        .filter(content => content.isSquareWithFeatures)
        .find(square => {
            return (square as SquareWithFeatures).data.floorFeatures.includes(blueStar)
        })

    if (squareWithStar && squareWithStar.isInSameSquareAs(actor)) {
        return new MovementAction("TURN", RelativeDirection.RIGHT)
    }

    const distanceToMove = .1

    const howCloseToGet = .5
    const whereToLookForBlockage = actor.translate({
        x: actor.data.direction.x * howCloseToGet,
        y: actor.data.direction.y * howCloseToGet,
    })

    if (game.data.level.isBlocked(...actor.coords, ...whereToLookForBlockage.coords)) {
        return new MovementAction("TURN", RelativeDirection.LEFT)
    } else {
        return new MovementByAction(distanceToMove, RelativeDirection.FORWARD)
    }
}


const areAllDucksOnTheStar = (level: Level, game: Game) => {

    const ducks: Figure[] = level.data.contents
        .filter(content => content.isVantage)
        .filter(vantage => (vantage as Figure).data.sprite && (vantage as Figure).data.sprite === mySprites.duckSprite)
        .map(duck => duck as Figure)

    const squareWithStar = level.data.contents
        .filter(content => content.isSquareWithFeatures)
        .find(square => {
            return (square as SquareWithFeatures).data.floorFeatures.includes(blueStar)
        })

    if (!squareWithStar) { return false }

    return ducks.every(duck => duck.isInSameSquareAs(squareWithStar))
}


const duckPuzzleLevel1 = new Level({
    height: 6,
    width: 8,
    startingVantage: {
        x: 1, y: 4, direction: Direction.north,
    },
    defaultWallPattern: sprites.brickWall,
    floorColor: new Color(100, 40, 40),
    walls: [
        new Wall({ x: 0, y: 3, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 1, y: 3, place: Direction.north, features: [hintForLevel1] }),
        new Wall({ x: 2, y: 3, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 3, y: 3, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 4, y: 2, place: Direction.west, shape: doorway, open: true, features: [door1] }),
        new Wall({ x: 4, y: 1, place: Direction.west, features: [lever1] }),
        new Wall({ x: 4, y: 0, place: Direction.west }),
        new Wall({ x: 6, y: 0, place: Direction.west }),
        new Wall({ x: 6, y: 1, place: Direction.west }),
        new Wall({ x: 6, y: 1, place: Direction.south }),
        new Wall({ x: 6, y: 1, place: Direction.east }),
        new Wall({ x: 7, y: 0, place: Direction.south }),
    ],
    contents: [
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar), initialAnimation: "WALK" }),

        new SquareWithFeatures({
            x: 7, y: 5, direction: Direction.north, floorFeatures: [blueStar]
        }),

        new SquareWithFeatures({
            x: 7, y: 2, direction: Direction.north, floorFeatures: [pit1]
        }),

        new SquareWithFeatures({
            x: 5, y: 2, direction: Direction.north, floorFeatures: [floorSwitch]
        }),

    ],
    items: [
    ],
    controllers: [
        new Controller({
            inputs: [lever1], defaultSubjectState: "CLOSED", subject: door1,
            statusMap: [[["ON"], "OPEN"]]
        }),

        new Controller({
            inputs: [floorSwitch], subject: pit1, defaultSubjectState: "OPEN", useWeightAsStatusForFloorFeatures: true, statusMap: [
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
    startingVantage: {
        x: 1, y: 2, direction: Direction.east,
    },
    // defaultWallPattern: sprites.brickWall,
    floorColor: new Color(30, 120, 90),
    walls: [
        new Wall({ x: 5, y: 2, place: Direction.north, shape: lowWall, }),
        new Wall({ x: 5, y: 2, place: Direction.south, shape: lowWall, }),
        new Wall({ x: 5, y: 3, place: Direction.east, features: [hintForLevel2] }),
        new Wall({ x: 4, y: 2, place: Direction.north, shape: lowWall, }),
        new Wall({ x: 4, y: 2, place: Direction.south, shape: lowWall, }),
        new Wall({ x: 4, y: 2, place: Direction.west, features: [door1], open: true, shape: doorway }),
    ],
    contents: [
        duck({ x: 5.5, y: 2.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar), initialAnimation: "WALK" }),

        new SquareWithFeatures({
            x: 1, y: 2, direction: Direction.north, floorFeatures: [blueStar]
        }),

        new SquareWithFeatures({
            x: 3, y: 1, direction: Direction.north, floorFeatures: [floorSwitch2]
        }),

        new SquareWithFeatures({
            x: 3, y: 3, direction: Direction.north, floorFeatures: [floorSwitch]
        }),

    ],
    items: [
        new Item({
            type: itemTypes.weight, vantage: new Vantage({ x: 4.5, y: 3.75, direction: Direction.north })
        }),
    ],
    controllers: [
        new Controller({
            inputs: [floorSwitch, floorSwitch2], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subject: door1,
            statusMap: [[[FloorFeature.WEIGHED, FloorFeature.WEIGHED], "OPEN"]]
        }),
    ],
    victoryCondition: areAllDucksOnTheStar,
    victoryMessage: "You're getting the hang of this!"
}).withWallsAround()

const duckPuzzleLevel3 = new Level({
    height: 7,
    width: 7,
    startingVantage: {
        x: 0, y: 0, direction: Direction.east,
    },
    floorColor: new Color(120, 90, 30),
    walls: [

        new Wall({ x: 2, y: 2, place: Direction.north, }),
        new Wall({ x: 3, y: 2, place: Direction.north, shape:doorway, open:true, features:[door1] }),
        new Wall({ x: 4, y: 2, place: Direction.north, }),

        new Wall({ x: 2, y: 4, place: Direction.south, }),
        new Wall({ x: 3, y: 4, place: Direction.south, shape:doorway, open:true, features:[door2]}),
        new Wall({ x: 4, y: 4, place: Direction.south, }),

        new Wall({ x: 2, y: 2, place: Direction.west, }),
        new Wall({ x: 2, y: 3, place: Direction.west, features:[lever1] }),
        new Wall({ x: 2, y: 4, place: Direction.west, }),

        new Wall({ x: 4, y: 2, place: Direction.east, }),
        new Wall({ x: 4, y: 3, place: Direction.east, }),
        new Wall({ x: 4, y: 4, place: Direction.east, }),

        new Wall({ x: 4, y: 6, place: Direction.west, shape:doorway, open:true, features:[door1] }),
    ],
    contents: [
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar), initialAnimation: "WALK" }),
        duck({ x: 0.5, y: 3.5, direction: Direction.north, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar), initialAnimation: "WALK" }),

        new SquareWithFeatures({
            x: 3, y: 3, direction: Direction.north, floorFeatures: [blueStar]
        }),

        new SquareWithFeatures({
            x: 4, y: 0, direction: Direction.north, floorFeatures: [pitClosed]
        }),

        new SquareWithFeatures({
            x: 3, y: 0, direction: Direction.north, floorFeatures: [floorSwitch]
        }),

    ],
    items: [

    ],
    controllers: [
        new Controller({
            inputs: [floorSwitch], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subject: pitClosed,
            statusMap: [[[FloorFeature.WEIGHED], "OPEN"]]
        }),
        new Controller({
            inputs: [floorSwitch], defaultSubjectState: "CLOSED", useWeightAsStatusForFloorFeatures: true, subject: door1,
            statusMap: [[[FloorFeature.WEIGHED], "OPEN"]]
        }),
        new Controller({
            inputs: [lever1], defaultSubjectState: "CLOSED", subject: door2,
            statusMap: [[["ON"], "OPEN"]]
        }),
    ],
    victoryCondition: areAllDucksOnTheStar,
    victoryMessage: "Something something ducks!"
}).withWallsAround()

export {duckPuzzleLevel1, duckPuzzleLevel2, duckPuzzleLevel3}