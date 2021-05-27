class Color {
    r: number
    g: number
    b: number
    a: number

    constructor(r: number, g: number, b: number, a?: number) {
        this.r = r
        this.g = g
        this.b = b
        this.a = typeof a === 'number' ? a : 1
    }

    get css() {
        const { r, g, b, a } = this
        return `rgba(${r},${g},${b},${a})`
    }

    darker(amount: number): Color {
        const { r, g, b, a } = this
        return new Color(r - amount, g - amount, b - amount, a).normalise()
    }

    lighter(amount: number): Color {
        const { r, g, b, a } = this
        return new Color(r + amount, g + amount, b + amount, a).normalise()
    }

    normalise(): Color {
        function normaliseComponent(v: number) {
            return v < 0 ? 0 : v > 255 ? 255 : v
        }
        function normaliseAlpha(v: number) {
            return v < 0 ? 0 : v > 1 ? 1 : v
        }

        this.r = normaliseComponent(this.r)
        this.g = normaliseComponent(this.g)
        this.b = normaliseComponent(this.b)
        this.a = normaliseAlpha(this.a)
        return this
    }
}


export { Color }