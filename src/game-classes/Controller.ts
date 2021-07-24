import { AbstractFeature } from "./AbstractFeature";


interface ControllerData {
    inputs: AbstractFeature[]
    subject: AbstractFeature

    statusChangeOnInputTrigger?: string

    statusMap?: [string[], string][]
    defaultSubjectState?: string
}


class Controller {
    data: ControllerData

    constructor(config: ControllerData) {
        this.data = config
    }

    get inputStatus(): string[] {
        //TO DO - check floorFeature.hasWeight, not floorfeature.data.status
        const status: string[] = this.data.inputs.map(feature => feature.data.status || feature.defaultStatus)
        return status
    }

    reactToTriggers(featuresTriggeredThisTurn: AbstractFeature[]): void {
        const { inputs, statusChangeOnInputTrigger, subject } = this.data;

        if (statusChangeOnInputTrigger) {
            const inputsTriggered = featuresTriggeredThisTurn.filter(feature => inputs.includes(feature))

            if (inputsTriggered.length > 0) {
                subject.setStatus(statusChangeOnInputTrigger)
            }
        }

    }

    reactToInputStatus(): void {
        const { inputStatus } = this
        const { statusMap, subject, defaultSubjectState } = this.data;

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
                subject.setStatus(matchingEntry[1])
            } else if (defaultSubjectState) {
                subject.setStatus(defaultSubjectState)
            }
        }
    }

}

export { Controller, ControllerData }