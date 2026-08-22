
class PointBar {
    current: number
    max: number

    constructor(current: number, max: number) {
        this.current = current
        this.max = max
    }

    up(amount: number): number {
        this.current = Math.min(this.current + amount, this.max);
        return this.current
    }

    down(amount: number): number {
        this.current = Math.max(this.current - amount, 0);
        return this.current
    }
}



class CharacterStats {
    health: PointBar
    stamina: PointBar
    mana: PointBar

    constructor(health: [number, number], stamina: [number, number], mana: [number, number] = [0,0]) {
        this.health = new PointBar(health[0], health[1])
        this.stamina = new PointBar(stamina[0], stamina[1])
        this.mana = new PointBar(mana[0], mana[1])
    }

    get isDead(): boolean {
        return this.health.current <= 0
    }
}

export { CharacterStats, PointBar }