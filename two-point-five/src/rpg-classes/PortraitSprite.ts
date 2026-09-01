import { Sprite } from "@/canvas/Sprite";

export class PortraitSprite extends Sprite {
    constructor(name: string, sheet: string) {
        const config = {
            id: name,
            animations: {
                [PortraitSprite.defaultPortraitAnimation]: [{ sheet }]
            }
        }
        super(config)
    }

    static get defaultPortraitAnimation(): "NEUTRAL" { return "NEUTRAL" }
}