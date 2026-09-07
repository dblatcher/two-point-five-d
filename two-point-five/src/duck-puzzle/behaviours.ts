import { Action, MovementAction, MovementByAction } from "@/game-classes/Action";
import { Actor } from "@/game-classes/Actor";
import { Behaviour } from "@/game-classes/Behaviour";
import { FloorFeature } from "@/game-classes/FloorFeature";
import { Game } from "@/game-classes/Game";
import { Level } from "@/game-classes/Level";
import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { duckPuzzleSprites as mySprites } from "./sprites";

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

function moveAntiClockwiseUnlessOnStar(actor: Actor, game: Game, _behaviour: Behaviour): Action | null {

    const { vantage } = actor.data;
    if (!vantage) return null

    const squareWithStar = (game.currentLevel.data.squaresWithFeatures || [])
        .find(square => {
            return square.floorFeatures.includes(blueStar)
        })

    if (squareWithStar && squareWithStar.isInSameSquareAs(vantage)) {
        return null
    }

    const distanceToMove = .1

    const howCloseToGet = .5
    const whereToLookForBlockage = vantage.translate({
        x: vantage.direction.x * howCloseToGet,
        y: vantage.direction.y * howCloseToGet,
    })

    if (game.currentLevel.isBlocked(...vantage.coords, ...whereToLookForBlockage.coords, actor, game)) {
        return new MovementAction("TURN", RelativeDirection.LEFT)
    } else {
        return new MovementByAction(distanceToMove, RelativeDirection.FORWARD)
    }
}

const areAllDucksOnTheStar = (level: Level, game: Game):boolean => {

    const ducks: Actor[] = (level.data.actors || [])
        .filter(npc => npc.sprite?.id === mySprites.duckSprite.id)
        .filter(npc => npc.data.vantage)

    const squareWithStar = (game.currentLevel.data.squaresWithFeatures || [])
        .find(square => {
            return square.floorFeatures.includes(blueStar)
        })

    if (!squareWithStar) { return false }

    return ducks.every(duck => duck.data.vantage && duck.data.vantage.isInSameSquareAs(squareWithStar))
}


export {
    areAllDucksOnTheStar, moveAntiClockwiseUnlessOnStar, blueStar
}