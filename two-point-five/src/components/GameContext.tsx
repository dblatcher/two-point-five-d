import { Game, GameConfig } from "@/game-classes/Game";
import { game } from "@/test-world";
import { createContext, useContext } from "react";

export const GameContext = createContext<{
    game: () => Game
    gameData: GameConfig
}>({
    game: () => game,
    gameData: game.data,
})

export const useGame = () => useContext(GameContext)