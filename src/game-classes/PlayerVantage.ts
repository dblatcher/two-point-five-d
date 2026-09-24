import { PlotConfig, Point } from "@/canvas/canvas-utility";
import { Color } from "@/canvas/Color";
import { Vantage, VantageConfig, VantageTupple } from "./Vantage";


class PlayerVantage extends Vantage {

    data: VantageConfig
    constructor(config: VantageConfig) {
        super(config)
        this.data = config
    }

    drawInMapConfig: PlotConfig = { noClose: false, noFill: false, fillStyle: Color.RED.css, strokeStyle: Color.BLACK.css }

    get drawInMapPoints(): Point[][] {
        const d = this.direction;
        const origin = { x: 0, y: 0 }
        const arrowEnd = d.translatePoint(origin, .4)
        let arrowLeft = d.leftOf.translatePoint(origin, .2);
        arrowLeft = d.behind.translatePoint(arrowLeft, .1)
        let arrowRight = d.rightOf.translatePoint(origin, .2);
        arrowRight = d.behind.translatePoint(arrowRight, .1)
        return [[arrowEnd, arrowLeft, origin, arrowRight]]
    }

    static fromTupple(input: VantageTupple) {
        const [x, y, direction] = input;
        return new PlayerVantage({ x, y, direction })
    }
}

export { PlayerVantage };

