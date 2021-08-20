
class PointBar {
    current: number
    max: number

    constructor(current: number, max: number) {
        this.current = current
        this.max = max
    }
}



class CharacterStats {
    health: PointBar
    stamina: PointBar
    mana: PointBar

    constructor(health: [number, number], stamina:[number,number], mana:[number,number]) {
        this.health = new PointBar(health[0], health[1])
        this.stamina = new PointBar(stamina[0], stamina[1])
        this.mana = new PointBar(mana[0], mana[1])
    }
}

export { CharacterStats, PointBar }