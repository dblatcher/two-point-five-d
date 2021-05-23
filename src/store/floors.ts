import { Direction } from "@/game-classes/Direction";
import { Floor } from "@/game-classes/Floor";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";



const position = new Vantage({ x: 3, y: 3, direction: Direction.west });

const floor = new Floor({
    height: 8, width: 10, walls: [
        new Wall({ x: 2, y: 2, place: 'NORTH' }),
        new Wall({ x: 2, y: 2, place: 'SOUTH' }),
        new Wall({ x: 5, y: 4, place: 'WEST' }),
        new Wall({ x: 8, y: 5, place: 'SOUTH' }),
        new Wall({ x: 8, y: 5, place: 'WEST' }),
        new Wall({ x: 8, y: 5, place: 'EAST' }),
    ]
})


export { floor, position }