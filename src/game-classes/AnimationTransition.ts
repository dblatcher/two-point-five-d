class AnimationTransition {
    startStatus: string
    endStatus: string
    duration: number

    constructor(startStatus: string, endStatus: string, duration: number) {
        this.duration = duration
        this.startStatus = startStatus
        this.endStatus = endStatus
    }

    get animationKey(): string {
        return `${this.startStatus}^${this.endStatus}`
    }

    get reversedAnimationKey(): string {
        return `${this.endStatus}^${this.startStatus}`
    }

    getTransitionPhase(transitionTickCount: number, transitionReversed: boolean): number {
        if (transitionReversed) {
            return (this.duration - transitionTickCount) / this.duration
        }
        return transitionTickCount / this.duration
    }
}

export {AnimationTransition}