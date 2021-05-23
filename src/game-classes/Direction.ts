class Direction {
    name: string
    x: 1 | 0 | -1
    y: 1 | 0 | -1


    constructor(name: string, x: 1 | 0 | -1, y: 1 | 0 | -1) {
        this.name = name
        this.x = x
        this.y = y
    }

    get rightOf(): Direction {
        let answer = noWhere;
        Direction.cardinal.forEach(direction => {
            if (direction.x == -this.y && direction.y == this.x) {
                answer = direction
            }
        })
        return answer;
    }

    get leftOf(): Direction {
        let answer = noWhere;
        Direction.cardinal.forEach(direction => {
            if (direction.x == this.y && direction.y == -this.x) {
                answer = direction
            }
        })
        return answer || null;
    }

    get behind(): Direction {
        let answer = noWhere;
        Direction.cardinal.forEach(direction => {
            if (direction.x == -this.x && direction.y == -this.y) {
                answer = direction
            }
        })
        return answer || null;
    }

    static get cardinal(): Map<string, Direction> {
        const map = new Map();
        map.set("NORTH", NORTH)
        map.set("EAST", EAST)
        map.set("SOUTH", SOUTH)
        map.set("WEST", WEST)
        return map
    }

    static get north() { return NORTH }
    static get south() { return SOUTH }
    static get east() { return EAST }
    static get west() { return WEST }
}

const noWhere = new Direction("?", 0, 0);
const NORTH = new Direction('NORTH', 0, -1);
const SOUTH = new Direction('SOUTH', 0, 1);
const EAST = new Direction('EAST', 1, 0);
const WEST = new Direction('WEST', -1, 0)

export { Direction }