"use client";
import { useContext, createContext, ReactNode, useState } from "react";
import { Game, gameToString } from "@/types";

interface GameContextType {
  game: Game | null;
  updateGame: (updatedGame: Game) => void;
  gameId: string | null;
  clearGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameId, setGameId] = useState<string | null>(() => {
    if (typeof window !== "undefined")
      return sessionStorage.getItem("current_game_id") as string;
    else return null;
  });

  const updateGame = (updatedGame: Game) => {
    if (updatedGame?.gameId) {
      console.log("Received new Game from the server");
      console.log(gameToString(updatedGame)); // For debuggin purposes
      // Update the session state in the case of a refresh
      sessionStorage.setItem("current_game_id", updatedGame.gameId);
      setGameId(updatedGame.gameId);
    }

    setGame((prev) => {
      if (!prev) {
        return updatedGame;
      }

      return {
        ...prev,
        ...updatedGame,
      };
    });
  };

  const clearGame = () => {
    sessionStorage.removeItem("current_game_id");
    setGame(null);
    setGameId(null);
  };

  return (
    <GameContext value={{ game, updateGame, gameId, clearGame }}>
      {children}
    </GameContext>
  );
};
