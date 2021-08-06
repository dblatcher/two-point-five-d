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

const features = {
    door1, door2, hintForDuckGame, blueStar, lever1, floorSwitch, pit1
}

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


export {
    features, moveAntiClockwiseUnlessOnStar
}