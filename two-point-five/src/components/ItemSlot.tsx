import { Item, ItemConfig } from "@/game-classes/Item";
import { CSSProperties, useEffect, useState } from "react";
import { useGame } from "./GameContext";


interface Props {
    itemData?: ItemConfig;
    getItem: { (): Item | undefined };
    size?: number;
    style?: CSSProperties;
}

const styles = {
    frame: {
        display: 'inline-flex',
    }
} satisfies Record<string, CSSProperties>

export const ItemSlot = ({ itemData, getItem, size = 50, style }: Props) => {
    const { game } = useGame()
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    useEffect(() => {
        if (!canvas) {
            return
        }
        const item = getItem()
        if (item) {
            item.drawAsIcon(game().spriteSheetMap, canvas)
        } else {
            Item.clearIcon(canvas)
        }
    }, [itemData?.type.name, getItem, canvas])

    return <div title={itemData?.type.name} style={style ?? styles.frame}>
        <canvas
            height={size} width={size}
            style={{ width: size, height: size }}
            ref={setCanvas}
        ></canvas>
    </div>
}
