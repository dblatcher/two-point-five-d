import { Game, GameConfig } from "@/game-classes/Game";
import { Character, CharacterData } from "@/rpg-classes/Character";
import { game } from "@/test-world";
import { createContext, RefObject, useContext, useEffect, useRef } from "react";

export const GameContext = createContext<{
    game: () => Game
    gameData: GameConfig
    emitter: EventTarget
}>({
    game: () => game,
    gameData: game.data,
    emitter: new EventTarget(),
})

export const useGame = () => useContext(GameContext)

export const useGameTick = (callback:{():void}) => {
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