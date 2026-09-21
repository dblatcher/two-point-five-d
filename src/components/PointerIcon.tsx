import { CSSProperties, ReactNode, useEffect, useState } from "react"

interface Props {
    children?: ReactNode;
}

const styles = {
    aside: {
        pointerEvents: 'none',
        overflow: 'hidden',
        position: 'fixed',
        inset: 0,
    },
    place: {
        position: 'absolute',
        left: 0,
        top: 0,
    }
} satisfies Record<string, CSSProperties>

export const PointerIcon = ({ children }: Props) => {
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    useEffect(() => {
        let refreshTime = Date.now()
        const watchPointer = (event: PointerEvent) => {
            const timeSince = Date.now() - refreshTime;
            if (timeSince < 50) {
                return
            }
            refreshTime = Date.now()
            const { clientX, clientY } = event;

            setX(Math.floor(clientX))
            setY(Math.floor(clientY))
        }
        window.addEventListener('pointermove', watchPointer)
        return () => {
            window.removeEventListener('pointermove', watchPointer)
        }
    }, [])

    return (
        <aside style={styles.aside}>
            <span style={{
                ...styles.place,
                transform: `translateX(${x}px) translateY(${y}px)`
            }}>
                {children}
            </span>
        </aside>
    )
}