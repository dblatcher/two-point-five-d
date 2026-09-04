import { Item, ItemConfig } from "@/game-classes/Item";
import { CSSProperties } from "react";
import { SpriteIcon } from "./SpriteIcon";


interface Props {
    item?: Item;
    size?: number;
    style?: CSSProperties;
}


export const ItemSlot = ({ item, size = 50, style }: Props) => {
    return <SpriteIcon
        style={style}
        size={size}
        spriteId={item?.itemType.icon.id}
        backgroundFill={item?.itemType.backgroundColor.css}
    />
}
