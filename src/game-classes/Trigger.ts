import { Game } from "./Game"
import { ItemType } from "./Item"
import { WallFeature } from "./WallFeature"

interface TriggerConfig {
    targetId: string
    statusPairs?: [string, string][]
    toggle?: string[]
    requiresItem?: ItemType
    consumesItem?: boolean
}

class Trigger {
    data: TriggerConfig

    constructor(config: TriggerConfig) {
        this.data = config
    }

    fire(firingFeature: WallFeature, game: Game): void {
        const { statusPairs, toggle, requiresItem, consumesItem } = this.data
        const { itemInHand } = game.data;

        if (requiresItem) {
            if (requiresItem !== itemInHand?.data.type) {
                console.log(`Do not have ${requiresItem.description}.`)
                return
            }
            if (consumesItem) {
                console.log(`Used up ${requiresItem.description}.`)
                game.data.itemInHand = undefined;
            }
        }

        const target = this.findTarget(game);
        if (!target) {
            console.warn(`trigger target with id ${this.data.targetId} not found`)
            return
        }

        if (statusPairs) {
            statusPairs.forEach(pair => {
                if (firingFeature.data.animation == pair[0]) { target.setStatus(pair[1]) }
            })
        } else if (toggle) {
            const indexOfCurrentStatus = toggle.indexOf(target.data.animation);
            if (indexOfCurrentStatus !== -1) {
                const nextStatus = toggle[indexOfCurrentStatus + 1] || toggle[0]
                target.setStatus(nextStatus);
            }
        }
    }

    findTarget(game: Game): WallFeature | undefined {
        const allFeatures: WallFeature[] = [];
        game.data.level.data.walls.forEach(wall => {
            if (wall.data.features) { allFeatures.push(...wall.data.features) }
        })
        return allFeatures.find(feature => feature.data.id == this.data.targetId)
    }
}


export { Trigger }