import { Color } from "@/game-classes/Color";
import { Direction } from "@/game-classes/Direction";
import { Level } from "@/game-classes/Level";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";



const position = new Vantage({ x: 8, y: 0, direction: Direction.west });

const floor = new Level({
    height: 8, width: 10, walls: [
        new Wall({ x: 1, y: 3, place: Direction.north }),
        new Wall({ x: 1, y: 1, place: Direction.south, color: new Color(200, 255, 0) }),
        new Wall({ x: 1, y: 2, place: Direction.north, color: new Color(200, 100, 90, 1) }),
        new Wall({ x: 3, y: 3, place: Direction.east }),
        new Wall({ x: 3, y: 3, place: Direction.north }),
        new Wall({ x: 3, y: 3, place: Direction.south }),
        new Wall({ x: 4, y: 3, place: Direction.south }),
        new Wall({ x: 5, y: 3, place: Direction.south }),

        new Wall({ x: 0, y: 0, place: Direction.west }),
        new Wall({ x: 0, y: 0, place: Direction.north, color: new Color(200, 100, 90, 1) }),
        new Wall({ x: 1, y: 0, place: Direction.north, color: new Color(20, 250, 190) }),
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