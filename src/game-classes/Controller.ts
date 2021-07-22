import { FloorFeature } from "./FloorFeature";
import { WallFeature } from "./WallFeature";

interface ControllerData {
    inputs: Array<WallFeature | FloorFeature>
    subject: WallFeature
}


class Controller {
    data: ControllerData

    constructor(config: ControllerData) {
        this.data = config
    }

    get inputStatus(): boolean[] {
        const status: boolean[] = []

        return status
    }

}

export { Controller, ControllerData }