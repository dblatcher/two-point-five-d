import { useCallback } from "react";
import { useCharacter, useGame } from "./GameContext";
import { ItemSlot } from "./ItemSlot";

interface Props {
    characterIndex: number
    equipmentSlot: string
}

export const EquipmentSlotButton = ({ characterIndex, equipmentSlot }: Props) => {

    const { game } = useGame()
    const [data, ref] = useCharacter(characterIndex)

    const getItem = useCallback(() => {
        return ref.current?.data.equipmentSlots?.get(equipmentSlot) ?? undefined
    }, [equipmentSlot])

    return <button
        style={{
            padding: 0
        }}
        onClick={() => {
            game().handleEquipSlotClick({
                slotName: equipmentSlot,
                character: ref.current,
            })
        }}>
        <ItemSlot size={30}
            itemData={data?.equipmentSlots?.get(equipmentSlot)?.data ?? undefined}
            getItem={getItem} />
    </button>

}