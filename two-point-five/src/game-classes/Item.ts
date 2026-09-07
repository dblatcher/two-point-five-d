import { Point } from "@/canvas/canvas-utility";
import { Actor } from "@/game-classes/Actor";
import { Direction } from "./Direction";
import { Figure } from "./Figure";
import { Game } from "./Game";
import { ItemType } from "./ItemType";
import { Blockage } from "./Level";
import { Position } from "./Position";
import { Vantage, VantageConfig } from "./Vantage";


interface ItemConfig {
    vantage?: Vantage
    type: string
    altitude?: number
    momentum?: number
}

interface ItemInput {
    vantage?: VantageConfig
    type: string
    altitude?: number
    momentum?: number
}

class Item {

    data: ItemConfig
    itemType: ItemType
    constructor(config: ItemInput, itemType: ItemType) {
        this.data = {
            ...config,
            vantage: config.vantage && new Vantage(config.vantage),
        }
        this.itemType = itemType
    }

    serialise(): ItemInput {
        return {
            ...this.data,
            vantage: this.data.vantage?.data
        }
    }

    static ofType(itemType: ItemType, config: Omit<ItemInput, 'type'> & { type?: string } = {}) {
        return new Item({
            ...config,
            type: itemType.data.id,
        }, itemType)
    }

    get propertyList(): [string, string | number][] {
        return this.itemType.propertyList
    }

    get figure(): Figure | null {
        const { vantage, altitude = 0 } = this.data
        const { figureDimensions = { width: .2, height: .2 }, sprite } = this.itemType.data
        if (vantage) {
            return Figure.ofSprite(
                sprite,
                {
                    ...vantage.data,
                    ...figureDimensions,
                    altitude,
                })
        }

        return null
    }

    handleInteraction(_actor: Vantage | Actor, game: Game): void {
        const { items } = game.currentLevel.data;
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
            ...position.data, direction: direction.name
        })
        game.currentLevel.data.items.push(this)
    }

    launch(pointInBackOfScreen: Point, vantage: Vantage, game: Game): void {
        const { direction } = vantage;

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
            direction: direction.name,
        })
        this.data.altitude = .5
        this.data.momentum = 10
        game.currentLevel.data.items.push(this)
    }

    flyThroughAir(game: Game): void {
        if (!this.data.altitude) {
            this.data.momentum = 0
        }
        if (this.data.altitude && this.data.altitude > 0) {
            this.data.altitude = Math.max(0, this.data.altitude - .05)
        }
        if (this.data.momentum && this.data.momentum > 0) {
            this.data.momentum = Math.max(0, this.data.momentum - 1)
            const blockage = this.data.vantage?.moveAbsoluteBy(.15, this.data.vantage.direction, game)

            if (blockage) { this.handleImpactWith(blockage, game) }
        }
    }

    handleImpactWith(blockage: Blockage, game: Game): void {
        console.log(blockage)

        switch (blockage.blockageClass) {
            case Actor:
                blockage.actor?.handleBeingHitByFlyingItem(this, game);
                break;
        }

        this.data.momentum = 0
    }
}


export { Item, ItemConfig };
