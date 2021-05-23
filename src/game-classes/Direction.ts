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

        map.set("NORTH", new Direction('NORTH', 0, -1))
        map.set("EAST", new Direction('EAST', 1, 0))
        map.set("SOUTH", new Direction('SOUTH', 0, 1))
        map.set("WEST", new Direction('WEST', -1, 0))
        return map
    }
}

const noWhere = new Direction("?", 0, 0);

export { Direction }