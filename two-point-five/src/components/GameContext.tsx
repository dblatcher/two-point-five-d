import { Game, GameConfig } from "@/game-classes/Game";
import { Character, CharacterData } from "@/rpg-classes/Character";
import { game } from "@/test-world";
import { createContext, RefObject, useContext, useEffect, useRef } from "react";

export const GameContext = createContext<{
    game: () => Game
    gameData: GameConfig
}>({
    game: () => game,
    gameData: game.data,
})

export const useGame = () => useContext(GameContext)

export const useCharacter = (index: number): [CharacterData | undefined, RefObject<Character | undefined>, boolean] => {
    const { gameData, game } = useGame()
    const characterData = gameData.characters.at(index)?.data;
    const isActive = index === gameData.activeCharacterIndex;
    const characterRef = useRef<Character>(undefined)
    useEffect(() => {
        characterRef.current = game().data.characters.at(index)
    }, [index])
    return [characterData, characterRef, isActive]
}