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
        backgroundColor: Game.CHARACTER_COLORS[index].css,
        display: 'grid',
        gridTemplateAreas: `
            "a b b c"
            "a d d c"
            "a d d c"
        `,
    }}>
        <div style={{ gridArea: 'a' }}>
            <StatBars stats={data.stats} />
        </div>
        <div style={{
            gridArea: 'b',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
        }}>
            <b >{data.name}</b>
        </div>

        <div style={{ gridArea: 'c', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <img style={{ height: "100%" }} src={ref.current?.portraitSrc ?? undefined} />
        </div>

        <div style={{ gridArea: 'd', }}>
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