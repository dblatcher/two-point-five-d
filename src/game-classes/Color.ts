class Color {
    r: number
    g: number
    b: number
    a?: number

    constructor(r: number, g: number, b: number, a?: number) {
        this.r = r
        this.g = g
        this.b = b
        this.a = typeof a === 'number' ? a : 1
    }

    get css() {
        const {r,g,b,a} = this
        return `rgba(${r},${g},${b},${a})`
    }

}


export { Color }