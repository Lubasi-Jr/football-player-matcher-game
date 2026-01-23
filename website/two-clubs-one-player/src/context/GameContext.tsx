"use client";
import { useContext, createContext, ReactNode, useState } from "react";
import { Game, gameToString } from "@/types";

interface GameContextType {
  game: Game | null;
  updateGame: (updatedGame: Game) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<Game | null>(null);

  const updateGame = (updatedGame: Game) => {
    if (game) {
      console.log("Received new Game from the server");
      console.log(gameToString(game));
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

  return <GameContext value={{ game, updateGame }}>{children}</GameContext>;
};
