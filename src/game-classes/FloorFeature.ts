import { Direction } from "./Direction";
import { Vantage } from "./Vantage";


interface FloorFeatureConfig {
    x: number
    y: number
    direction: Direction
}


class FloorFeature extends Vantage {
    data: FloorFeatureConfig

    constructor(config: FloorFeatureConfig) {
        super(config)
        this.data = config
    }

    get isFloorFeature(): boolean { return true }
    get squareX(): number { return .5 }
    get squareY(): number { return .5 }


}

export { FloorFeature }