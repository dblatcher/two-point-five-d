import { CSSProperties } from "react"
import { useGame } from "./GameContext"
import { SpriteIcon } from "./SpriteIcon"
import { Sprite } from "@/canvas/Sprite"

const styles = {
    entry: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
    }
} satisfies Record<string, CSSProperties>

export const MessageBox = () => {

    const { gameData } = useGame()

    return <section>
        {gameData.narrativeMessages.map((message, index) => (
            <div key={index} style={styles.entry}>
                {message.data.character && (
                    <SpriteIcon spriteId={message.data.character.data.portrait.id} actionName={Sprite.defaultPortraitAnimation} />
                )}

                <p style={{ color: message.data.color.css }}>
                    {message.data.content}
                </p>
            </div>
        ))}
    </section>
}