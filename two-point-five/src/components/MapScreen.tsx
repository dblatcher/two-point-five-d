import { CSSProperties, useEffect, useState } from "react"
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
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'black',
        color: 'white',
    },
    section: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapCanvas: {
        maxWidth: "100%"
    }
} satisfies Record<string, CSSProperties>



export const MapScreen = ({ close }: Props) => {
    const { gameData, game } = useGame()
    const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!mapCanvas) {
            return
        }
        const gameInstance = game();
        gameInstance.currentLevel.drawAsMap(mapCanvas, gameData.playerVantage, 25)
    }, [mapCanvas, gameData])

    return <article style={styles.frame}>
        <header style={{ ...styles.header, gridArea: 'a' }}>
            <div>Map</div>
            <button onClick={close}>close</button>
        </header>
        <section style={{ gridArea: 'b', ...styles.section }}>
            <canvas ref={setMapCanvas} style={styles.mapCanvas}></canvas>
        </section>
    </article>

}