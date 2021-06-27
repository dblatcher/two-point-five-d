import { Vantage } from './Vantage'
import { Level } from './Level'
import { Action, InterAction, MovementAction } from './Action'
import { Figure } from './Figure'
import { PointerLocator } from './PointerLocator'
import { Position } from './Position'
import { playerVantage } from '@/store/levels'
import { WallFeature } from './WallFeature'
import { Wall } from './Wall'
import { RelativeDirection } from './RelativeDirection'

interface Movement { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }

interface GameConfig {
    playerVantage: Vantage,
    level: Level
}

class Game {
    data: GameConfig
    queuedPlayerActions: Action[]
    tickCount: number
    pointerLocator: PointerLocator

    static MAX_QUEUE_LENGTH: 10

    constructor(config: GameConfig) {
        this.data = config;
        this.queuedPlayerActions = []
        this.tickCount = 0
        this.pointerLocator = new PointerLocator;
        this.tick = this.tick.bind(this)
    }


    tick(): void {
        this.tickCount++;
        this.data.level.tickCount = this.tickCount

        const nextPlayerAction = this.queuedPlayerActions.shift();
        if (nextPlayerAction) {
            nextPlayerAction.perform(playerVantage, this);
        }

        this.data.level.data.contents
            .filter(item => Object.getPrototypeOf(item).constructor == Figure)
            .forEach(item => {
                const figure = item as Figure;

                if (figure.data.behaviour) {
                    figure.data.behaviour.decideAction(figure, this)?.perform(figure, this)
                }
            })
    }

    queuePlayerMovementAction(movement: Movement): void {
        if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
            return
        }
        this.queuedPlayerActions.push(new MovementAction(movement.action, RelativeDirection[movement.direction]))
    }

    handleSightClick(clickInfo: { x: number, y: number }): void {
        const { level, playerVantage } = this.data
        const { walls, items } = level.data
        const location = this.pointerLocator.locate(clickInfo, level.hasWallInFace(playerVantage))
        if (!location) { return }

        let wallClicked: Wall | undefined = undefined;
        let featureClicked: WallFeature | null = null;

        if (location.zone == "FRONT_WALL") {
            wallClicked =
                walls.find(wall => wall.isInSameSquareAs(playerVantage) && wall.isFacing(playerVantage.data.direction)) ||
                walls.find(wall => wall.isInSameSquareAs(playerVantage.translate(playerVantage.data.direction)) && wall.isFacing(playerVantage.data.direction.behind));
        }

        if (location.zone == "RIGHT_WALL") {
            wallClicked =
                walls.find(wall => wall.isInSameSquareAs(playerVantage) && wall.isFacing(playerVantage.data.direction.rightOf)) ||
                walls.find(wall => wall.isInSameSquareAs(playerVantage.translate(playerVantage.data.direction.rightOf)) && wall.isFacing(playerVantage.data.direction.leftOf));
        }

        if (location.zone == "LEFT_WALL") {
            wallClicked =
                walls.find(wall => wall.isInSameSquareAs(playerVantage) && wall.isFacing(playerVantage.data.direction.leftOf)) ||
                walls.find(wall => wall.isInSameSquareAs(playerVantage.translate(playerVantage.data.direction.leftOf)) && wall.isFacing(playerVantage.data.direction.rightOf));
        }

        if (wallClicked) {
            featureClicked = this.pointerLocator.identifyClickedFeature(location, wallClicked);
        }

        if (featureClicked && featureClicked.canInteract) {
            if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
                return
            }
            this.queuedPlayerActions.push(new InterAction(featureClicked));
        }

        const itemClicked = this.pointerLocator.identifyClickedItemOnFloor(this.data.playerVantage, items, clickInfo)


        if (itemClicked) {
            if (this.queuedPlayerActions.length >= Game.MAX_QUEUE_LENGTH) {
                return
            }
            this.queuedPlayerActions.push(new InterAction(itemClicked));
        }

        if (location.zone == "FLOOR" && !itemClicked) {
            const rotatedLocation = this.pointerLocator.identifyPointOnFloorSquare(location, playerVantage.data.direction);

            const positionClicked = new Position({
                x: playerVantage.data.x + rotatedLocation.x,
                y: playerVantage.data.y + rotatedLocation.y
            }).translate(playerVantage.data.direction)

            level.data.contents.push(positionClicked)
        }
    }
}

export { Game, GameConfig }