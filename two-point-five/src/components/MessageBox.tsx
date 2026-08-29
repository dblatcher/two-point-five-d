import { CSSProperties } from "react"
import { useGame } from "./GameContext"

const styles = {
    entry: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
    }
} satisfies Record<string, CSSProperties>

export const MessageBox = () => {

    const { gameData, game } = useGame()

    return <section>
        {gameData.narrativeMessages.map((message, index) => (
            <div key={index} style={styles.entry}>

                {message.data.character && (
                    <img src={message.data.character?.getPortraitSrc(game().spriteSheetMap) ?? ''} />
                )}


                <p style={{ color: message.data.color.css }}>
                    {message.data.content}
                </p>
            </div>
        ))}
    </section>
}