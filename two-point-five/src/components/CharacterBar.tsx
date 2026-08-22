import { useCallback, useEffect, useRef } from "react"
import { useGame } from "./GameContext"
import { Character } from "@/rpg-classes/Character";
import { ItemSlot } from "./ItemSlot";
import { Game } from "@/game-classes/Game";



const CharacterBlock = ({ index }: { index: number }) => {
    const { gameData, game } = useGame()
    const data = gameData.characters.at(index)?.data;
    const ref = useRef<Character>(undefined)

    useEffect(() => {
        ref.current = game().data.characters.at(index)
    }, [index])

    const getRightHandItem = useCallback(() => {
        return ref.current?.data.equipmentSlots?.get("RIGHT_HAND") ?? undefined
    }, [])
    const getLeftHandItem = useCallback(() => {
        return ref.current?.data.equipmentSlots?.get("LEFT_HAND") ?? undefined
    }, [])

    if (!data) {
        return <div></div>
    }

    return <div style={{
        display: 'grid',
        gridTemplateColumns: "3fr 1fr"
    }}>
        <div>
            <div>
                <b style={{
                    color: Game.CHARACTER_COLORS[index].css,
                    backgroundColor: 'wheat'
                }}>{data.name}</b>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: "1fr 1fr"
            }}>
                <div>
                    <progress style={{ maxWidth: 80, display: 'block' }} max={data.stats.health.max} value={data.stats.health.current} />
                    <progress style={{ maxWidth: 80, display: 'block' }} max={data.stats.stamina.max} value={data.stats.stamina.current} />
                    <progress style={{ maxWidth: 80, display: 'block' }} max={data.stats.mana.max} value={data.stats.mana.current} />
                </div>
                <div>
                    <button onClick={() => {
                        game().handleEquipSlotClick({
                            slotName: 'LEFT_HAND',
                            character: ref.current,
                        })
                    }}>
                        <ItemSlot size={40}
                            itemData={data.equipmentSlots?.get("LEFT_HAND")?.data ?? undefined}
                            getItem={getLeftHandItem} />
                    </button>
                    <button onClick={() => {
                        game().handleEquipSlotClick({
                            slotName: 'RIGHT_HAND',
                            character: ref.current,
                        })
                    }}>
                        <ItemSlot size={40}
                            itemData={data.equipmentSlots?.get("RIGHT_HAND")?.data ?? undefined}
                            getItem={getRightHandItem} />
                    </button>
                </div>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'stretch', alignItems: 'stretch' }}>
            <img src={ref.current?.portraitSrc ?? undefined} />
        </div>
    </div>
}

export const CharacterBar = () => {

    const { gameData } = useGame()

    return <section style={{
        display: 'grid',
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
    }}>
        {gameData.characters.map((_character, index) => (
            <CharacterBlock index={index} key={index} />
        ))}

    </section>
}