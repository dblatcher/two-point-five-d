import { CharacterStats, PointBar } from "@/rpg-classes/CharacterStats";

interface Props {
    stats: CharacterStats
}

const Bar = ({ stat }: { stat: PointBar }) =>
    <div style={{ position: 'relative', height: 75, width: 10 }}>
        <progress
            style={{
                width: 75,
                height: 15,
                display: 'block',
                transformOrigin: 'top left',
                transform: 'translateY(100%) rotate(-90deg) translateY(-16%)',
                position: 'absolute',
                bottom: 0,
                left: 0,
            }}
            max={stat.max} value={stat.current}
        />
    </div>

export const StatBars = ({ stats }: Props) => {

    return <div style={{ display: 'inline-flex', width:30 }}>
        <Bar stat={stats.health} />
        <Bar stat={stats.stamina} />
        <Bar stat={stats.mana} />
    </div>
}