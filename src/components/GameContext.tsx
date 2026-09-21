import { Game, GameConfig } from "@/game-classes/Game";
import { Character, CharacterData } from "@/rpg-classes/Character";
import { game } from "@/test-world";
import { useGameRunner } from "@/useGameRunner";
import { createContext, ReactNode, RefObject, useContext, useEffect, useRef } from "react";

export const GameContext = createContext<{
    game: () => Game
    gameData: GameConfig
    emitter: EventTarget
}>({
    game: () => game,
    gameData: game.data,
    emitter: new EventTarget(),
})

type GameProviderProps = {
    children?: ReactNode;
    game: Game
}
export const GameProvider = ({ children, game }: GameProviderProps) => {
    const { ready, gameData, gameRef, emitter } = useGameRunner(game)
    if (!ready) {
        return null
    }

    return (
        <GameContext.Provider value={{
            game: () => gameRef.current,
            gameData,
            emitter
        }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => useContext(GameContext)

export const useGameTick = (callback: { (): void }) => {
    const { emitter } = useGame()
    return useEffect(() => {
        emitter.addEventListener('tick', callback)
        return () => emitter.removeEventListener('tick', callback)
    }, [emitter, callback])
}

export const useCharacter = (index: number): [CharacterData | undefined, RefObject<Character | undefined>, boolean] => {
    const { gameData, game } = useGame()
    const characterData = gameData.characters.at(index)?.data;
    const isActive = index === gameData.activeCharacterIndex;
    const characterRef = useRef<Character>(undefined)
    useEffect(() => {
        characterRef.current = game().data.characters.at(index)
    }, [index, game().data.characters])
    return [characterData, characterRef, isActive]
}