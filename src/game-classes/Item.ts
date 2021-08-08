import { Direction } from "./Direction";
import { Figure } from "./Figure";
import { Game } from "./Game";
import { Position } from "./Position";
import { RelativeDirection } from "./RelativeDirection";
import { Sprite } from "../canvas/Sprite";
import { Vantage } from "./Vantage";
import { ItemType } from "./ItemType";
import { Point } from "@/canvas/canvas-utility";


interface ItemConfig {
    vantage?: Vantage
    type: ItemType
    altitude?: number
    momentum?: number
}

class Item {

    data: ItemConfig
    constructor(config: ItemConfig) {
        this.data = config
    }

    get propertyList(): [string, string | number][] {
        return this.data.type.propertyList
    }

    get figure(): Figure | null {
        const { vantage, altitude = 0 } = this.data
        const { figureDimensions = { width: .2, height: .2 }, sprite } = this.data.type.data
        if (vantage) {
            return new Figure({
                sprite,
                ...vantage.data,
                ...figureDimensions,
                altitude,
            })
        }

        return null
    }

    get icon(): CanvasImageSource {
        try {
            return this.data.type.data.sprite.provideImage(Sprite.defaultFigureAnimation, RelativeDirection.BACK, 0)
        } catch (error) {
            console.warn(error.message)
        }
        return document.createElement('img');
    }

    drawAsIcon(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) { return }
        const height = Number(canvas.getAttribute('height') || "100");
        const width = Number(canvas.getAttribute('width') || "100");
        const { icon } = this
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = this.data.type.backgroundColor.css;
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(icon, 0, 0, width, height)
    }

    static clearIcon(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) { return }
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

    launch(pointInBackOfScreen: Point, vantage: Vantage, game: Game): void {
        const { direction } = vantage.data;

        const howFarRight = pointInBackOfScreen.x

        const thrownPoint = direction.rotatePoint({ x: howFarRight, y: howFarRight })
        const squareAhead = vantage.translate(direction)

        switch (direction) {
            case Direction.north:
                squareAhead.squareX = 1 - thrownPoint.x;
                squareAhead.squareY = 1
                break;
            case Direction.south:
                squareAhead.squareX = 1 - thrownPoint.x;
                squareAhead.squareY = 0
                break;
            case Direction.east:
                squareAhead.squareX = 0
                squareAhead.squareY = thrownPoint.y;
                break;
            case Direction.west:
                squareAhead.squareX = 1
                squareAhead.squareY = thrownPoint.y;
                break;
        }

        this.data.vantage = new Vantage({
            ...squareAhead.data,
            direction
        })
        this.data.altitude = .5
        this.data.momentum = 10
        game.data.level.data.items.push(this)
    }

    flyThroughAir(game: Game): void {
        if (!this.data.altitude) {
            this.data.momentum = 0
        }
        if (this.data.altitude && this.data.altitude > 0) {
            this.data.altitude = Math.max(0, this.data.altitude - .05)
        }
        if (this.data.momentum && this.data.momentum > 0) {
            this.data.vantage?.moveAbsoluteBy(.15, this.data.vantage.data.direction, game)
            this.data.momentum = Math.max(0, this.data.momentum - 1)
        }
    }
}


export { Item, ItemConfig }