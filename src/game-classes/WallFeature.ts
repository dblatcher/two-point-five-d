import { Point } from "@/canvas/canvas-utility"
import { Sprite } from "@/game-classes/Sprite"
import { Direction } from "./Direction"
import { Game } from "./Game"
import { Trigger } from "./Trigger"

const relativeDirections = ["FORWARD", "BACK", "LEFT", "RIGHT"]

interface WallFeatureConfig {
    sprite: Sprite
    animation: string
    id?: string
    triggers?: Trigger[]
}

class WallFeature {
    data: WallFeatureConfig

    constructor(config: WallFeatureConfig) {
        this.data = config
        this.data.animation = this.data.animation || Sprite.defaultWallAnimation

        const { missingAnimations } = this
        if (missingAnimations.length > 0) { console.warn('Missing animations on WallFeature', this, missingAnimations) }
    }

    get requiredAnimations(): string[] { return [Sprite.defaultWallAnimation] }

    get missingAnimations() {
        const missing: string[] = [];

        this.requiredAnimations.forEach(animationName => {

            relativeDirections.forEach(relativeDirection => {
                if (
                    !this.data.sprite.animations.has(`${animationName}_${relativeDirection}`) &&
                    !this.data.sprite.animations.has(`${animationName}`)
                ) {
                    missing.push(`${animationName}_${relativeDirection}`)
                }

            })
        })
        return missing
    }

    get isBlocking(): boolean { return false }
    get canInteract(): boolean { return false }
    get isDrawnInMap(): boolean { return false }

    setStatus(animation:string) {
        if (this.requiredAnimations.includes(animation)) {
            this.data.animation = animation
        } else {
            console.warn(`invalid animation [${animation}] for wall feature`, this)
        }
    }

    handleInteraction(game: Game): void {
        return this.fireTriggers(game)
    }

    fireTriggers(game: Game): void {
        const { triggers = [] } = this.data

        triggers.forEach(trigger => {
            trigger.fire(this, game)
        });
    }

    drawInMap(place: Direction, squareCenter: Point): Point[][] {
        const edgeMiddle = place.translatePoint(squareCenter, .5);
        const leftCorner = place.leftOf.translatePoint(edgeMiddle, .5);
        const rightCorner = place.rightOf.translatePoint(edgeMiddle, .5);
        const switchEnd = place.behind.translatePoint(edgeMiddle, .15);

        return [
            [rightCorner, edgeMiddle, switchEnd, edgeMiddle, leftCorner]
        ]
    }
}

class WallSwitch extends WallFeature {

    get requiredAnimations(): string[] { return ["OFF", "ON"] }
    get canInteract(): boolean { return true }
    get isDrawnInMap(): boolean { return true }

    handleInteraction(game: Game): void {
        if (this.data.animation === "OFF") {
            this.setStatus("ON");
        } else {
            this.setStatus("OFF");
        }

        this.fireTriggers(game)
    }
}


interface DoorConfig {
    sprite: Sprite
    animation: string
    id?: string
    triggers?: Trigger[]
    canOpenDirectly?: boolean
}

class Door extends WallFeature {
    data: DoorConfig

    constructor(config: DoorConfig) {
        super(config)
        this.data = config
    }

    get requiredAnimations(): string[] { return ["OPEN", "CLOSED"] }

    get isBlocking(): boolean { return this.data.animation === "CLOSED" }
    get canInteract(): boolean { return !!this.data.canOpenDirectly }
    get isDrawnInMap(): boolean { return true }

    handleInteraction(game: Game): void {
        if (this.data.animation === "OPEN") {
            this.setStatus("CLOSED");
        } else {
            this.setStatus("OPEN");
        }
    }

    drawInMap(place: Direction, squareCenter: Point): Point[][] {

        const edge = place.translatePoint(squareCenter, .5);
        const leftCorner = place.leftOf.translatePoint(edge, .5);
        const rightCorner = place.rightOf.translatePoint(edge, .5);
        const leftMiddle = place.leftOf.translatePoint(edge, .25);
        const rightMiddle = place.rightOf.translatePoint(edge, .25);
        const rightMiddleBack = place.translatePoint(rightMiddle, .1);
        const leftMiddleBack = place.translatePoint(leftMiddle, .1);

        if (this.isBlocking) {
            return [
                [rightCorner, leftCorner, leftMiddle, leftMiddleBack, rightMiddleBack, rightMiddle, rightCorner]
            ]
        } else {
            return [
                [leftCorner, leftMiddle, leftMiddleBack,],
                [rightMiddleBack, rightMiddle, rightCorner],
            ]
        }
    }

}

export { WallFeature, WallSwitch, Door }