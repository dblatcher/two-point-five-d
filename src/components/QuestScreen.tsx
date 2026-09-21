import { Quest } from "@/rpg-classes/Quest"
import { CSSProperties } from "react"
import { useGame } from "./GameContext"

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

const QuestDisplay = ({ quest }: { quest: Quest }) => {
    const { game } = useGame()
    const { title, description, goals } = quest.data

    return (
        <div>
            <p><b>{title}</b></p>
            <p>{description}</p>
            <ul>{goals.map((goal, index) => (
                <li key={index} >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                    }}>
                        <span>{goal.narrative}</span>
                        <b>
                            {Quest.testGoalComplete(goal, game()) ? '☑' : '☐'}
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
                <QuestDisplay key={index} quest={quest} />
            ))}
        </section>
    </article>

}