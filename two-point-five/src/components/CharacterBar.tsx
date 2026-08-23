import { Game } from "@/game-classes/Game";
import { EquipmentSlotButton } from "./EquipmentSlotButton";
import { useCharacter, useGame } from "./GameContext";
import { StatBars } from "./StatBars";



const CharacterBlock = ({ index }: { index: number }) => {
    const [data, ref] = useCharacter(index)
    if (!data) {
        return <div></div>
    }

    return <div style={{
        display: 'flex',
    }}>
        <StatBars stats={data.stats} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div>
                <b style={{
                    color: Game.CHARACTER_COLORS[index].css,
                    backgroundColor: 'wheat'
                }}>{data.name}</b>
            </div>
            <img style={{ height: 40 }} src={ref.current?.portraitSrc ?? undefined} />
        </div>

        <div>
            <EquipmentSlotButton characterIndex={index} equipmentSlot="LEFT_HAND" />
            <EquipmentSlotButton characterIndex={index} equipmentSlot="RIGHT_HAND" />
        </div>
    </div>
}

export const CharacterBar = () => {

    const { gameData } = useGame()

    return <section style={{
        display: 'grid',
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
    }}>
        {gameData.characters.map((_character, index) => (
            <CharacterBlock index={index} key={index} />
        ))}

    </section>
}