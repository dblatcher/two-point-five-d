import { VIEWSIZE } from "@/constants"
import { Game, GameInputs } from "@/game-classes/Game"
import { DirectionName } from "@/types"
import { ReactNode, useCallback, useRef, useState } from "react"
import { Arrows } from "./Arrows"
import { AttackButtons } from "./AttackButtons"
import { CharacterBar } from "./CharacterBar"
import { CharacterScreen } from "./CharacterScreen"
import { useGame } from "./GameContext"
import { Intersitial } from "./Intersitial"
import { ItemSlot } from "./ItemSlot"
import { MapScreen } from "./MapScreen"
import { MessageBox } from "./MessageBox"
import { PointerIcon } from "./PointerIcon"
import { QuestScreen } from "./QuestScreen"
import { SightCanvas } from "./SightCanvas"


const UiRow = ({ children }: { children?: ReactNode }) => {
    return <section style={{
        display: 'grid',
        gridTemplateColumns: `${VIEWSIZE}px 1fr 250px`,
    }}>{children}</section>
}


export const RpgGameLayout = () => {
    const { gameData, game } = useGame()
    const [characterScreenOpen, setCharacterScreenOpen] = useState<number>()
    const [questScreenOpen, setQuestScreenOpen] = useState(false)
    const [mapScreenOpen, setMapScreenOpen] = useState(false)

    const move = useCallback((direction: DirectionName) => {
        game().queuePlayerMovementAction({ action: 'MOVE', direction })
    }, [])

    const turn = useCallback((direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK") => {
        game().queuePlayerMovementAction({ action: 'TURN', direction })
    }, [])

    const savedGame = useRef<GameInputs>(null)
    const [hasSave, setHasSave] = useState(false)

    return <main>
        <UiRow>
            <span>{gameData.itemInHand?.itemType.name ?? " "}</span>
            <div></div>
            <div>
                <button onClick={() => setQuestScreenOpen(true)}>quests</button>
                <button onClick={() => setMapScreenOpen(true)}>map</button>

                <button onClick={() => {
                    const input = game().serialiseData();
                    savedGame.current = input
                    setHasSave(true)
                }}>save</button>
                <button
                    disabled={!hasSave}
                    onClick={() => {
                        const { current } = savedGame;
                        if (!current) {
                            return
                        }
                        game().loadData(current)
                    }}
                >load</button>
            </div>
        </UiRow>

        <UiRow>
            <CharacterBar setCharacterScreenOpen={setCharacterScreenOpen} />
        </UiRow>


        <UiRow>
            <SightCanvas />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <AttackButtons />
                <div style={{ marginTop: 'auto' }}>
                    <Arrows move={move} turn={turn} />
                </div>

            </div>
        </UiRow>

        <MessageBox />

        {
            gameData.intersitial && (
                <Intersitial
                    intersitialData={gameData.intersitial.data}
                    selectOption={(index) => game().handleInterstitialOptionClick(index)} />
            )
        }
        {
            typeof characterScreenOpen === 'number' && (
                <CharacterScreen
                    characterIndex={characterScreenOpen}
                    close={() => setCharacterScreenOpen(undefined)} />
            )
        }
        {
            questScreenOpen && (
                <QuestScreen close={() => setQuestScreenOpen(false)} />
            )
        }
        {
            mapScreenOpen && (
                <MapScreen close={() => setMapScreenOpen(false)} />
            )
        }
        <PointerIcon >
            <ItemSlot item={gameData.itemInHand} />
        </PointerIcon>
    </main >
}
