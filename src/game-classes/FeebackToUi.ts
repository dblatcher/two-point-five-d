

export class FeedbackToUI {
    message?: string
    propertyList?: [string, string | number][]
    success?: boolean

    constructor(input: {
        message?: string
        propertyList?: [string, string | number][]
        success?: boolean
    }) {
        this.message = input.message
        this.propertyList = input.propertyList
        this.success = input.success
    }

    get isEmpty(): boolean {
        return !this.message && !this.propertyList
    }

    static get empty(): FeedbackToUI { return new FeedbackToUI({}) }
    static get yes(): FeedbackToUI { return new FeedbackToUI({ success: true }) }
    static get no(): FeedbackToUI { return new FeedbackToUI({ success: false }) }
}
