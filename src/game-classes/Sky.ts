import { Color } from "@/canvas/Color";

interface SkyData {
    skyBaseColor: Color
    sun?:boolean
}

class Sky {
    data: SkyData

    constructor(data: SkyData) {
        this.data = data
    }
}


export { Sky }