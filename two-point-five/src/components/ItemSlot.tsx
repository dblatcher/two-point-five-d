import { Item, ItemConfig } from "@/game-classes/Item";
import { CSSProperties } from "react";
import { SpriteIcon } from "./SpriteIcon";


interface Props {
    itemData?: ItemConfig;
    size?: number;
    style?: CSSProperties;
}


export const ItemSlot = ({ itemData, size = 50, style }: Props) => {
    return <SpriteIcon
        style={style}
        size={size}
        spriteId={itemData?.type.icon.id}
        backgroundFill={itemData?.type.backgroundColor.css}
    />
}
