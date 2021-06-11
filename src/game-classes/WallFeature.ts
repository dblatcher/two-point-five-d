import { Sprite } from "@/canvas/Sprite"

interface WallFeatureConfig {
    sprite:Sprite
    animation: string
}

class WallFeature {
    data: WallFeatureConfig

    constructor(config:WallFeatureConfig) {
        this.data = config
    }
}

export { WallFeature }