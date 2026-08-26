import { CSSProperties } from "react"
import { useGame } from "./GameContext"
import { QuestData } from "@/rpg-classes/Quest"

interface Props {
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
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'black',
        color: 'white',
    },
} satisfies Record<string, CSSProperties>

const QuestDisplay = ({ questData }: { questData: QuestData }) => {
    const { game } = useGame()


    return (
        <div>
            <p><b>{questData.title}</b></p>
            <p>{questData.description}</p>
            <ul>{questData.goals.map((goal, index) => (
                <li key={index} >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                    }}>
                        <span>{goal.data.narrative}</span>
                        <b>
                            {goal.testComplete(game()) ? '☑' : '☐'}
                        </b>
                    </div>
                </li>
            ))}</ul>
        </div>
    )
}

export const QuestScreen = ({ close }: Props) => {
    const { gameData } = useGame()

    const takenQuests = (gameData.quests ?? []).filter(quest => quest.data.state === 'TAKEN')

    return <article style={styles.frame}>
        <header style={{ ...styles.header, gridArea: 'a' }}>
            <div>Quests</div>
            <button onClick={close}>close</button>
        </header>
        <section style={{ gridArea: 'b' }}>
            {takenQuests?.map((quest, index) => (
                <QuestDisplay key={index} questData={quest.data} />
            ))}
        </section>
    </article>

}