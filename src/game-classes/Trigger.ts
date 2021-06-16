import { Game } from "./Game"
import { WallFeature } from "./WallFeature"

interface TriggerConfig {
    targetId: string
    statusPairs?: [string, string][]
}

class Trigger {
    data: TriggerConfig

    constructor(config: TriggerConfig) {
        this.data = config
    }

    fire(firingFeature: WallFeature, game: Game) {
        const { statusPairs = [] } = this.data
        const target = this.findTarget(game);
        if (!target) {
            console.warn(`trigger target with id ${this.data.targetId} not found`)
            return
        }

        statusPairs.forEach(pair => {
            if (firingFeature.data.animation == pair[0]) { target.setStatus(pair[1]) }
        })
    }

    findTarget(game: Game) {

        const allFeatures: WallFeature[] = [];

        game.data.level.data.walls.forEach(wall => {
            if (wall.data.features) { allFeatures.push(...wall.data.features) }
        })

        return allFeatures.find(feature => feature.data.id == this.data.targetId)
    }
}


export { Trigger }