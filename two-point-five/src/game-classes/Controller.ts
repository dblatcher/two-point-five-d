import { AbstractFeature } from "./AbstractFeature";
import { FloorFeature } from "./FloorFeature";
import { Level } from "./Level";


interface ControllerData {
    inputIds: string[]
    subjectId: string
    useWeightAsStatusForFloorFeatures?: boolean
    statusChangeOnInputTrigger?: string
    statusMap?: [string[], string][]
    defaultSubjectState?: string
}


class Controller {
    data: ControllerData
    level?: Level

    constructor(config: ControllerData) {
        this.data = config
    }

    get subject(): AbstractFeature | undefined {
        if (!this.level) { return }
        return AbstractFeature.getFeatureFromKey(this.data.subjectId, AbstractFeature, this.level)
    }

    get inputs(): Array<AbstractFeature | undefined> {
        const { inputIds } = this.data;
        const { level } = this
        if (!level) { return inputIds.map(() => undefined) }

        return inputIds.map(
            id => AbstractFeature.getFeatureFromKey(id, AbstractFeature, level)
        )
    }

    get inputStatus(): string[] {
        const status: string[] = this.inputs.map(feature => {

            if (!feature) { return "" }

            if (this.data.useWeightAsStatusForFloorFeatures && feature.isFloorFeature) {
                return (feature as FloorFeature).hadWeightOnItLastTick ? FloorFeature.WEIGHED : FloorFeature.NOT_WEIGHED
            }

            return feature.data.status || feature.defaultStatus
        })
        return status
    }

    reactToTriggers(featuresTriggeredThisTurn: AbstractFeature[]): void {
        const { statusChangeOnInputTrigger } = this.data;
        const { subject, inputs } = this

        if (statusChangeOnInputTrigger) {
            const inputsTriggered = featuresTriggeredThisTurn.filter(feature => inputs.includes(feature))

            if (inputsTriggered.length > 0) {
                subject?.setStatus(statusChangeOnInputTrigger)
            }
        }

    }

    reactToInputStatus(): void {
        const { inputStatus } = this
        const { statusMap, defaultSubjectState } = this.data;
        const { subject } = this

        if (statusMap) {
            const matchingEntry = statusMap.find(entry => {
                const statusListToMatch = entry[0];
                if (statusListToMatch.length !== inputStatus.length) { return false }
                for (let index = 0; index < statusListToMatch.length; index++) {
                    if (inputStatus[index] !== statusListToMatch[index]) { return false }
                }
                return true
            })

            if (matchingEntry) {
                subject?.setStatus(matchingEntry[1])
            } else if (defaultSubjectState) {
                subject?.setStatus(defaultSubjectState)
            }
        }
    }

}

export { Controller, ControllerData }