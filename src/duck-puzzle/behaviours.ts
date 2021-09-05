import { Action, MovementAction, MovementByAction } from "@/game-classes/Action";
import { Actor } from "@/game-classes/Actor";
import { Behaviour } from "@/game-classes/Behaviour";
import { FloorFeature } from "@/game-classes/FloorFeature";
import { Game } from "@/game-classes/Game";
import { Level } from "@/game-classes/Level";
import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { sprites as mySprites } from "./sprites";

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

function moveAntiClockwiseUnlessOnStar(actor: Actor, game: Game, behaviour: Behaviour): Action | null {

    const { vantage } = actor.data;
    if (!vantage) return null

    const squareWithStar = (game.data.level.data.squaresWithFeatures || [])
        .find(square => {
            return square.data.floorFeatures.includes(blueStar)
        })

    if (squareWithStar && squareWithStar.isInSameSquareAs(vantage)) {
        return null
    }

    const distanceToMove = .1

    const howCloseToGet = .5
    const whereToLookForBlockage = vantage.translate({
        x: vantage.data.direction.x * howCloseToGet,
        y: vantage.data.direction.y * howCloseToGet,
    })

    if (game.data.level.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor, game)) {
        return new MovementAction("TURN", RelativeDirection.LEFT)
    } else {
        return new MovementByAction(distanceToMove, RelativeDirection.FORWARD)
    }
}

const areAllDucksOnTheStar = (level: Level, game: Game):boolean => {

    const ducks: Actor[] = (level.data.actors || [])
        .filter(npc => npc.data.sprite === mySprites.duckSprite)
        .filter(npc => npc.data.vantage)

    const squareWithStar = (game.data.level.data.squaresWithFeatures || [])
        .find(square => {
            return square.data.floorFeatures.includes(blueStar)
        })

    if (!squareWithStar) { return false }

    return ducks.every(duck => duck.data.vantage && duck.data.vantage.isInSameSquareAs(squareWithStar))
}


export {
    areAllDucksOnTheStar, moveAntiClockwiseUnlessOnStar, blueStar
}