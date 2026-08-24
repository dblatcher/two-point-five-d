import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { Arrows } from "./Arrows"
import { CharacterBar } from "./CharacterBar"
import { useGame } from "./GameContext"
import { Intersitial } from "./Intersitial"
import { ItemSlot } from "./ItemSlot"
import { SightCanvas } from "./SightCanvas"
import { DirectionName } from "@/types"
import { CharacterScreen } from "./CharacterScreen"

interface Props {
    setCanvas: Dispatch<SetStateAction<HTMLCanvasElement | null>>;
    canvas: HTMLCanvasElement | null;
}


export const RpgGameLayout = ({ setCanvas, canvas }: Props) => {
    const { gameData, game } = useGame()
    const [characterScreenOpen, setCharacterScreenOpen] = useState<number>()

    const move = useCallback((direction: DirectionName) => {
        game().queuePlayerMovementAction({ action: 'MOVE', direction })
    }, [])

    const turn = useCallback((direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK") => {
        game().queuePlayerMovementAction({ action: 'TURN', direction })
    }, [])

    const getItemInHand = useCallback(() => game().data.itemInHand, [])

    return <main>

        <CharacterBar setCharacterScreenOpen={setCharacterScreenOpen} />

        <section style={{
            display: 'grid',
            gridTemplateColumns: "500px 1fr",
        }}>
            <SightCanvas canvas={canvas} setCanvas={setCanvas} />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    margin: 5,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                }}>
                    <ItemSlot
                        itemData={gameData.itemInHand?.data}
                        getItem={getItemInHand}
                    />
                </div>
                <div style={{ marginTop: 'auto' }}>
                    <Arrows move={move} turn={turn} />
                </div>

            </div>
        </section>

        {gameData.intersitial && (
            <Intersitial
                intersitialData={gameData.intersitial.data}
                selectOption={(index) => game().handleInterstitialOptionClick(index)} />
        )}

        {typeof characterScreenOpen === 'number' && (
            <CharacterScreen
                characterIndex={characterScreenOpen}
                close={() => setCharacterScreenOpen(undefined)} />
        )}
    </main>

}