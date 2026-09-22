import { VIEWSIZE } from "@/constants"
import { GameInputs } from "@/game-classes/Game"
import { DirectionName } from "@/types"
import { ReactNode, useCallback, useRef, useState } from "react"
import { Arrows } from "./Arrows"
import { useGame } from "./GameContext"
import { Intersitial } from "./Intersitial"
import { ItemSlot } from "./ItemSlot"
import { MapScreen } from "./MapScreen"
import { MessageBox } from "./MessageBox"
import { PointerIcon } from "./PointerIcon"
import { QuestScreen } from "./QuestScreen"
import { SightCanvas } from "./SightCanvas"
import { MapCanvas } from "./MapCanvas"


const UiRow = ({ children }: { children?: ReactNode }) => {
    return <section style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5
    }}>{children}</section>
}


export const PuzzleGameLayout = () => {
    const { gameData, game } = useGame()
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
            <SightCanvas
                viewSize={VIEWSIZE / 2}
                getPOV={(game) => game.data.playerVantage.turnToLeft()}
            />
            <SightCanvas />
            <SightCanvas viewSize={VIEWSIZE / 2} getPOV={(game) => game.data.playerVantage.turnToRight()} />
        </UiRow>

        <UiRow>
            <MapCanvas style={{ background: 'ghostwhite' }} />
            <div style={{ flexBasis: 200 }}>
                <Arrows move={move} turn={turn} />
            </div>
            <MapCanvas style={{ background: 'ghostwhite' }} />
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
