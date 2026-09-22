import { CSSProperties } from "react"
import { MapCanvas } from "./MapCanvas"

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
    return <article style={styles.frame}>
        <header style={{ ...styles.header, gridArea: 'a' }}>
            <div>Map</div>
            <button onClick={close}>close</button>
        </header>
        <section style={{ gridArea: 'b', ...styles.section }}>
            <MapCanvas style={styles.mapCanvas} />
        </section>
    </article>

}