"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Game } from "@/types";

interface GameContextType {
  game: Game | null;
  setGame: (game: Game | null) => void;
  updateGame: (updates: Partial<Game>) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [game, setGameState] = useState<Game | null>(null);

  const setGame = useCallback((newGame: Game | null) => {
    setGameState(newGame);
  }, []);

  const updateGame = useCallback((updates: Partial<Game>) => {
    setGameState((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, []);

  const value: GameContextType = {
    game,
    setGame,
    updateGame,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
