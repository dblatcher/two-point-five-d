import { PlotConfig, Point } from "@/canvas/canvas-utility";
import { Color } from "@/canvas/Color";
import { Vantage, VantageConfig } from "./Vantage";


class PlayerVantage extends Vantage {

    data: VantageConfig
    constructor(config: VantageConfig) {
        super(config)
        this.data = config
    }

    drawInMapConfig: PlotConfig = { noClose: false, noFill: false, fillStyle: Color.RED.css, strokeStyle: Color.BLACK.css }

    get drawInMapPoints(): Point[][] {
        const { direction: d } = this.data;
        const origin = { x: 0, y: 0 }
        const arrowEnd = d.translatePoint(origin, .4)
        let arrowLeft = d.leftOf.translatePoint(origin,.2);
        arrowLeft = d.behind.translatePoint(arrowLeft,.1)
        let arrowRight = d.rightOf.translatePoint(origin,.2);
        arrowRight = d.behind.translatePoint(arrowRight,.1)
        return [[arrowEnd, arrowLeft, origin, arrowRight]]
    }

}

export { PlayerVantage };

