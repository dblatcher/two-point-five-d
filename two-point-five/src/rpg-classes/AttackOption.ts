interface AttackOptionData {
    name: string
    staminaCost: number
    cooldown: number
    damage: number
}

class AttackOption {
    data: AttackOptionData

    constructor(data: AttackOptionData) {
        this.data = data
    }

    static unarmedAttacks = [
        new AttackOption(
            { name: 'punch', damage: 1, staminaCost: 1, cooldown: 3 },
        ),
    ]
}


export { AttackOption }