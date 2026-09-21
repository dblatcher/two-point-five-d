import { CSSProperties, useState } from "react"
import { EquipmentSlotButton } from "./EquipmentSlotButton"
import { useCharacter, useGame } from "./GameContext"
import { InventorySlotButton } from "./InventorySlotButton"
import { FeedbackToUI } from "@/game-classes/Game"

interface Props {
    characterIndex: number
    close: { (): void }
}

const styles = {
    frame: {
        position: 'fixed',
        inset: "20%",
        backgroundColor: 'whitesmoke',
        padding: 10,
        borderWidth: 4,
        borderStyle: 'outset',
        display: 'grid',
        gridTemplateAreas: `
            "a a a"
            "b b c"
            "d d d"
            "d d d"
        `
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'black',
        color: 'white',
    },
    equipmentGrid: {
        display: 'grid',
        maxWidth: 120,
        gridTemplateAreas: `
            ". a ."
            "e b f"
            ". c ."
            ". d ."
        `,
    }
} satisfies Record<string, CSSProperties>

export const CharacterScreen = ({ characterIndex, close }: Props) => {
    const { game } = useGame()
    const [data, characterRef] = useCharacter(characterIndex)
    const [feedback, setFeedback] = useState<FeedbackToUI>()

    return <article style={styles.frame} key={characterIndex}>
        <header style={{ ...styles.header, gridArea: 'a' }}>
            <div>{data?.name}</div>
            <button onClick={close}>close</button>
        </header>
        <section style={{ gridArea: 'b' }}>
            <header>self</header>
            <button onClick={() => {
                const feedback = game().handleSelfClick({
                    buttonName: 'LOOK',
                    character: characterRef.current
                })
                setFeedback(feedback)
            }}>look</button>
            <button onClick={() => {
                const feedback = game().handleSelfClick({
                    buttonName: 'CONSUME',
                    character: characterRef.current
                })
                setFeedback(feedback)
            }}>consume</button>
            <div>
                {feedback?.message && <span>{feedback.message}</span>}
                {feedback?.propertyList && <>
                    {feedback.propertyList.map(([property, value], index) => (
                        <div key={index} >
                            {property} = {value}
                        </div>
                    ))}
                </>}
            </div>
        </section>
        <section style={{ gridArea: 'c' }}>
            <header>equipment</header>
            <div style={styles.equipmentGrid}>
                <EquipmentSlotButton gridArea="a" characterIndex={characterIndex} equipmentSlot="HEAD" />
                <EquipmentSlotButton gridArea="b" characterIndex={characterIndex} equipmentSlot="TORSO" />
                <EquipmentSlotButton gridArea="c" characterIndex={characterIndex} equipmentSlot="LEGS" />
                <EquipmentSlotButton gridArea="d" characterIndex={characterIndex} equipmentSlot="FEET" />
                <EquipmentSlotButton gridArea="e" characterIndex={characterIndex} equipmentSlot="LEFT_HAND" />
                <EquipmentSlotButton gridArea="f" characterIndex={characterIndex} equipmentSlot="RIGHT_HAND" />
            </div>
        </section>
        <section style={{ gridArea: 'd' }}>
            <header>inventory</header>
            <div style={{
                display: 'grid',
                gridTemplateColumns: "repeat(5, 1fr)"
            }}>
                {data?.inventory.map((_, index) => (
                    <InventorySlotButton key={index}
                        characterIndex={characterIndex}
                        inventoryIndex={index}
                    />
                ))}
            </div>
        </section>

    </article>

}