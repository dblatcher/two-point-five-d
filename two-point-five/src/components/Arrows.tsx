import { DirectionName } from "@/types";
import { CSSProperties } from "react";

interface Props {
    move: { (direction: DirectionName): void };
    turn: { (direction: DirectionName): void };
}

const styles = {
    section: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: 50
    }
} satisfies Record<string, CSSProperties>

export const Arrows = ({ move, turn }: Props) => {

    return <section style={styles.section}>
        <button onClick={() => { turn('LEFT') }}>↰</button>
        <button onClick={() => { move('FORWARD') }}>⇧</button>
        <button onClick={() => { turn('RIGHT') }}>↱</button>
        <button onClick={() => { move('LEFT') }}>⇦</button>
        <button onClick={() => { move('BACK') }}>⇩</button>
        <button onClick={() => { move('RIGHT') }}>⇨</button>
    </section>

}