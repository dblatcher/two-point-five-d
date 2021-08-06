import { sprites, textBoards } from "@/instances/sprites";
import { Door, InteractableWallFeature, WallFeature, WallSwitch } from "@/game-classes/WallFeature";
import { makeTunnel } from "@/game-classes/Reaction";
import { itemTypes } from "@/instances/itemTypes";
import { FloorFeature, Pit } from "@/game-classes/FloorFeature";

import { TextBoard } from "@/canvas/TextBoard"
import { Color } from "@/canvas/Color";
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
import { duck } from "./figureFactory";
import { doorway } from "./wallShapes";
import { Controller } from "@/game-classes/Controller";



const lever1 = new WallSwitch({ sprite: sprites.leverSprite, })


const hintForDuckGame = new WallFeature({
    clipToWall: true,
    textBoard: new TextBoard({
        content: [
            "Get the duck",
            "to the star!",
        ],
        size: { x: .8, y: .5 },
        textScale: 3,
        textColor: Color.BLUE,
        backgroundColor: Color.YELLOW,
    }),
})

const door1 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const door2 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })



const keyhole = new InteractableWallFeature({ sprite: sprites.keyHole, requiresItem: itemTypes.key, consumesItem: false, onBothSides: true })

const tunnel = makeTunnel();
const stairs = new InteractableWallFeature({ sprite: sprites.stairs, reactions: [tunnel[0]] })
const stairs2 = new InteractableWallFeature({ sprite: sprites.stairs, reactions: [tunnel[1]] })


const bigSquareOnFloor: [number, number][] = [
    [-.45, -.45], [.45, -.45], [.45, .45], [-.45, .45]
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

const pit1 = new Pit({ status: "OPEN" })



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


const duckPuzzleLevel = new Level({
    height: 6,
    width: 8,
    startingVantage: new Vantage({
        x: 1, y: 4, direction: Direction.north,
    }),
    defaultWallPattern: sprites.brickWall,
    floorColor: new Color(100, 40, 40),
    walls: [
        new Wall({ x: 0, y: 3, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 1, y: 3, place: Direction.north, features: [hintForDuckGame] }),
        new Wall({ x: 2, y: 3, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 3, y: 3, place: Direction.north, patternSprite: sprites.windowWall }),
        new Wall({ x: 4, y: 2, place: Direction.west, shape: doorway, open: true, features: [door1] }),
        new Wall({ x: 4, y: 1, place: Direction.west, features: [lever1] }),
        new Wall({ x: 4, y: 0, place: Direction.west }),
        new Wall({ x: 6, y: 1, place: Direction.north }),
        new Wall({ x: 6, y: 1, place: Direction.west }),
        new Wall({ x: 6, y: 1, place: Direction.south }),
        new Wall({ x: 6, y: 1, place: Direction.east }),
    ],
    contents: [
        duck({ x: 0.5, y: 0.5, direction: Direction.east, behaviour: new Behaviour(moveAntiClockwiseUnlessOnStar), initialAnimation: "WALK" }),

        new SquareWithFeatures({
            x: 7, y: 5, direction: Direction.north, floorFeatures: [
                blueStar
            ]
        }),

        new SquareWithFeatures({
            x: 7, y: 2, direction: Direction.north, floorFeatures: [
                pit1
            ]
        }),

        new SquareWithFeatures({
            x: 5, y: 2, direction: Direction.north, floorFeatures: [
                floorSwitch
            ]
        }),

    ],
    items: [

    ],
    victoryCondition(level: Level, game: Game) {

        const ducks: Figure[] = level.data.contents
            .filter(content => content.isVantage)
            .filter(vantage => (vantage as Figure).data.sprite && (vantage as Figure).data.sprite === sprites.duckSprite)
            .map(duck => duck as Figure)

        const squareWithStar = level.data.contents
            .filter(content => content.isSquareWithFeatures)
            .find(square => {
                return (square as SquareWithFeatures).data.floorFeatures.includes(blueStar)
            })

        if (!squareWithStar) { return false }

        return ducks.every(duck => duck.isInSameSquareAs(squareWithStar))
    }
}).withWallsAround()

const duckPuzzleControllers = [
    new Controller({
        inputs: [lever1], defaultSubjectState: "CLOSED", subject: door1,
        statusMap: [[["ON"], "OPEN"]]
    }),

    new Controller({
        inputs: [floorSwitch], subject: pit1, defaultSubjectState: "OPEN", useWeightAsStatusForFloorFeatures: true, statusMap: [
            [[FloorFeature.WEIGHED], "CLOSED"],
        ]
    }),
]

export {
    duckPuzzleLevel, duckPuzzleControllers
}