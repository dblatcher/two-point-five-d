import { AbstractFeature } from "./AbstractFeature"
import { FloorFeature } from "./FloorFeature"
import { Game } from "./Game"
import { ItemType } from "./ItemType"
import { WallFeature } from "./WallFeature"

interface TriggerConfig {
    targetId: string
    statusPairs?: [string, string][]
    toggle?: string[]
    weightSwitch?: [string, string]
    requiresItem?: ItemType
    consumesItem?: boolean
}

class Trigger {
    data: TriggerConfig

    constructor(config: TriggerConfig) {
        this.data = config
    }

    fire(firingFeature: AbstractFeature, game: Game): void {
        const { statusPairs, toggle, requiresItem, consumesItem, weightSwitch } = this.data
        const { itemInHand } = game.data;

        const featureClass = firingFeature.isFloorFeature ? FloorFeature : WallFeature;

        if (requiresItem) {
            if (requiresItem !== itemInHand?.data.type) {
                console.log(`Do not have ${requiresItem.name}.`)
                return
            }
            if (consumesItem) {
                console.log(`Used up ${requiresItem.name}.`)
                game.data.itemInHand = undefined;
            }
        }

        const target = this.findTarget(game);
        if (!target) {
            console.warn(`trigger target with id ${this.data.targetId} not found`)
            return
        }

        if (statusPairs && firingFeature.isWallFeature) {

            for (let index = 0; index < statusPairs.length; index++) {
                const pair = statusPairs[index];
                if ((firingFeature as WallFeature).data.animation == pair[0]) {
                    target.setStatus(pair[1])
                    console.log('trigger event!', target, this)
                    break
                }
            }

        } else if (toggle) {
            const indexOfCurrentStatus = toggle.indexOf(target.status);
            if (indexOfCurrentStatus !== -1) {
                const nextStatus = toggle[indexOfCurrentStatus + 1] || toggle[0]
                target.setStatus(nextStatus);
                console.log('trigger event!', target, this)
            } else {
                console.log('no trigger event happened')
            }
        } else if (weightSwitch && featureClass == FloorFeature) {
            const indexOfStatus = (firingFeature as FloorFeature).hadWeightOnItLastTick ? 1 : 0
            target.setStatus(weightSwitch[indexOfStatus])
            console.log('trigger event!', target, this)
        } else {
            console.log('no trigger event happened')
        }

    }

    findTarget(game: Game): AbstractFeature | undefined {
        const allFeatures: AbstractFeature[] = [];
        game.data.level.data.walls.forEach(wall => {
            if (wall.data.features) { allFeatures.push(...wall.data.features) }
        })
        return allFeatures.find(feature => feature.data.id == this.data.targetId)
    }
}


export { Trigger }