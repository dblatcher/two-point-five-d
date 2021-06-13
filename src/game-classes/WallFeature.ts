import { Sprite } from "@/game-classes/Sprite"
import { Game } from "./Game"

interface WallFeatureConfig {
    sprite: Sprite
    animation: string
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
            if (!this.data.sprite.animations.has(`${animationName}_FORWARD`)) { missing.push(`${animationName}_FORWARD`) }
            if (!this.data.sprite.animations.has(`${animationName}_BACK`)) { missing.push(`${animationName}_BACK`) }
            if (!this.data.sprite.animations.has(`${animationName}_LEFT`)) { missing.push(`${animationName}_LEFT`) }
            if (!this.data.sprite.animations.has(`${animationName}_RIGHT`)) { missing.push(`${animationName}_RIGHT`) }
        })
        return missing
    }

    get isBlocking(): boolean { return false }
    get canInteract(): boolean { return false }

    handleInteraction(game: Game): void {
        return
    }
}

class WallSwitch extends WallFeature {

    get requiredAnimations(): string[] { return ["OFF", "ON"] }
    get canInteract(): boolean { return true }
    handleInteraction(game: Game): void {
        if (this.data.animation === "OFF") {
            this.data.animation = "ON"
        } else {
            this.data.animation = "OFF"
        }

    }
}

class Door extends WallFeature {

    get requiredAnimations(): string[] { return ["OPEN", "CLOSED"] }

    get isBlocking(): boolean { return this.data.animation === "CLOSED" }
    get canInteract(): boolean { return true }

    handleInteraction(game: Game): void {
        console.log(this.data.animation)
        if (this.data.animation === "OPEN") {
            this.data.animation = "CLOSED"
        } else {
            this.data.animation = "OPEN"
        }

    }
}

export { WallFeature, WallSwitch, Door }