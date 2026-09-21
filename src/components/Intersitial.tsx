import { FeedbackToUI } from "@/game-classes/Game"
import { IntersitialData } from "@/game-classes/Intersitial"
import { CSSProperties } from "react"


interface Props {
    intersitialData: IntersitialData
    selectOption: { (optionIndex: number): FeedbackToUI }
}

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: "rgba(0,0,0,.2)",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modal: {
        backgroundColor: 'whitesmoke',
        color: 'saddlebrown',
        padding: 10,
        maxWidth: 500,
    }
} satisfies Record<string, CSSProperties>

export const Intersitial = ({ intersitialData, selectOption }: Props) => {
    return <div style={styles.overlay}>
        <aside style={styles.modal}>
            <header>
                {intersitialData.heading ?? "!"}
            </header>
            <section>
                {intersitialData.content}
            </section>
            <section>
                {intersitialData.options.map((option, index) => (
                    <button key={index} onClick={() => {
                        selectOption(index)
                    }}>{option.buttonText}</button>
                ))}
            </section>
        </aside>
    </div>
}