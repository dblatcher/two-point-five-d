import { useCharacter, useGame } from "./GameContext";
import { ItemSlot } from "./ItemSlot";

interface Props {
    characterIndex: number
    equipmentSlot: string
    gridArea?: string;
}

export const EquipmentSlotButton = ({ characterIndex, equipmentSlot, gridArea }: Props) => {

    const { game } = useGame()
    const [data, ref] = useCharacter(characterIndex)

    return <button
        style={{
            padding: 0,
            gridArea
        }}
        onClick={() => {
            game().handleEquipSlotClick({
                slotName: equipmentSlot,
                character: ref.current,
            })
        }}>
        <ItemSlot size={30}
            itemData={data?.equipmentSlots?.get(equipmentSlot)?.data ?? undefined}
        />
    </button>

}