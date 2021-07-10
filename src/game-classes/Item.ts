import { Direction } from "./Direction";
import { Figure } from "./Figure";
import { Game } from "./Game";
import { Position } from "./Position";
import { RelativeDirection } from "./RelativeDirection";
import { Sprite } from "../canvas/Sprite";
import { Vantage } from "./Vantage";

interface ItemType {
    description: string
    figureDimensions?: { width: number, height: number }
    sprite: Sprite
}

interface ItemConfig {
    vantage?: Vantage

    type: ItemType
}

class Item {
    data: ItemConfig
    constructor(config: ItemConfig) {
        this.data = config
    }

    get figure(): Figure | null {
        const { vantage } = this.data
        const { figureDimensions = { width: .2, height: .2 }, sprite } = this.data.type
        if (vantage) {
            return new Figure({
                sprite,
                ...vantage.data,
                ...figureDimensions,
            })
        }

        return null
    }

    get icon(): CanvasImageSource {
        try {
            return this.data.type.sprite.provideImage(Sprite.defaultFigureAnimation, RelativeDirection.BACK, 0)
        } catch (error) {
            console.warn(error.message)
        }
        return document.createElement('img');
    }

    drawAsIcon(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) {return}
        const height = Number(canvas.getAttribute('height') || "100");
        const width = Number(canvas.getAttribute('width') || "100");
        const { icon } = this
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = "brown"
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(icon, 0, 0, width, height)
    }

    static clearIcon(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) {return}
        const height = Number(canvas.getAttribute('height') || "100");
        const width = Number(canvas.getAttribute('width') || "100");
        ctx.clearRect(0, 0, width, height)
    }

    handleInteraction(actor: Vantage, game: Game): void {
        const { items } = game.data.level.data;
        if (!game.data.itemInHand) {
            this.takeIntoHand(items, game)
        }
    }

    takeIntoHand(items: Array<Item | null>, game: Game, swapNull = false): void {

        const index = items.indexOf(this);
        if (index !== -1) {
            if (swapNull) {
                items.splice(index, 1, null);
            } else {
                items.splice(index, 1);
            }
        }

        this.data.vantage = undefined;
        game.data.itemInHand = this;
    }

    placeAt(position: Position, direction: Direction, game: Game): void {
        this.data.vantage = new Vantage({
            ...position.data, direction
        })
        game.data.level.data.items.push(this)
    }
}


export { Item, ItemConfig, ItemType }