import { Item, ItemConfig } from "@/game-classes/Item";
import { CSSProperties, useEffect, useState } from "react";


interface Props {
    itemData?: ItemConfig;
    getItem: { (): Item | undefined };
    size?: number;
}

const style = {
    frame: {
        display: 'inline-flex',
    }
} satisfies Record<string, CSSProperties>

export const ItemSlot = ({ itemData, getItem, size = 50 }: Props) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    useEffect(() => {
        if (!canvas) {
            return
        }
        const item = getItem()
        if (item) {
            item.drawAsIcon(canvas)
        } else {
            Item.clearIcon(canvas)
        }
    }, [itemData?.type.name, getItem, canvas])

    return <div title={itemData?.type.name} style={style.frame}>
        <canvas
            height={size} width={size}
            style={{ width: size, height: size }}
            ref={setCanvas}
        ></canvas>
    </div>
}
