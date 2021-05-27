import { Direction } from "@/game-classes/Direction";
import { Floor } from "@/game-classes/Floor";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";



const position = new Vantage({ x: 7, y:7, direction: Direction.west });

const floor = new Floor({
    height: 8, width: 10, walls: [
        new Wall({ x: 1, y: 3, place: Direction.north }),
        new Wall({ x: 1, y: 2, place: Direction.north }),
        new Wall({ x: 3, y: 3, place: Direction.east }),
        new Wall({ x: 3, y: 3, place: Direction.north }),
        new Wall({ x: 3, y: 3, place: Direction.south }),
        new Wall({ x: 4, y: 3, place: Direction.south }),
        new Wall({ x: 5, y: 3, place: Direction.south }),

        new Wall({ x: 0, y: 0, place: Direction.west }),
        new Wall({ x: 0, y: 0, place: Direction.north }),
        new Wall({ x: 1, y: 0, place: Direction.north }),
        new Wall({ x: 2, y: 0, place: Direction.north }),
        new Wall({ x: 3, y: 0, place: Direction.north }),
        new Wall({ x: 4, y: 0, place: Direction.north }),
        new Wall({ x: 5, y: 0, place: Direction.north }),
        new Wall({ x: 6, y: 0, place: Direction.north }),
        new Wall({ x: 7, y: 0, place: Direction.north }),
        new Wall({ x: 8, y: 0, place: Direction.north }),
        new Wall({ x: 9, y: 0, place: Direction.north }),
        new Wall({ x: 9, y: 0, place: Direction.east }),

    ]
})


export { floor, position }