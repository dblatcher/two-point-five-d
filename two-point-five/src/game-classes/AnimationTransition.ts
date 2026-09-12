
interface AnimationTransitionInput {
    startStatus: string
    endStatus: string
    duration: number
}

class AnimationTransition {
    startStatus: string
    endStatus: string
    duration: number

    constructor({ startStatus, duration, endStatus }: AnimationTransitionInput) {
        this.duration = duration
        this.startStatus = startStatus
        this.endStatus = endStatus
    }
    serialise(): AnimationTransitionInput {
        const { startStatus, endStatus, duration } = this;
        return {
            startStatus, endStatus, duration
        }
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

export { AnimationTransition, AnimationTransitionInput }