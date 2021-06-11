import { Sprite } from "@/game-classes/Sprite"

interface WallFeatureConfig {
    sprite:Sprite
    animation: string
}

class WallFeature {
    data: WallFeatureConfig

    constructor(config:WallFeatureConfig) {
        this.data = config
        this.data.animation = this.data.animation || Sprite.defaultWallAnimation
    }
}

export { WallFeature }