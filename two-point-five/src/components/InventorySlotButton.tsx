import { useCallback } from "react";
import { useCharacter, useGame } from "./GameContext";
import { ItemSlot } from "./ItemSlot";

interface Props {
    characterIndex: number
    inventoryIndex: number
}

export const InventorySlotButton = ({ characterIndex, inventoryIndex }: Props) => {

    const { game } = useGame()
    const [data, ref] = useCharacter(characterIndex)

    const getItem = useCallback(() => {
        return ref.current?.data.inventory?.at(inventoryIndex) ?? undefined
    }, [inventoryIndex])

    return <button
        style={{
            padding: 0,
        }}
        onClick={() => {
            game().handleInventoryClick({
                item: getItem(),
                index: inventoryIndex,
                character: ref.current,
            })
        }}>
        <ItemSlot size={30}
            itemData={data?.inventory?.at(inventoryIndex)?.data ?? undefined}
            getItem={getItem} />
    </button>
}