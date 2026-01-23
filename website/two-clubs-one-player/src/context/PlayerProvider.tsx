"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Player = {
  playerId: string | null;
  username: string | null;
};

type PlayerContextType = {
  player: Player;
  newPlayer: boolean;
  setUsername: (username: string) => void;
  createGamePlayer: (username: string) => Player;
  clearPlayer: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const STORAGE_KEY = "player";

function generatePlayerId() {
  return crypto.randomUUID();
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player>({
    playerId: null,
    username: null,
  });

  const [newPlayer, setNewPlayer] = useState(true);

  /** Load player from sessionStorage */
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed: Player = JSON.parse(stored);
      setPlayer(parsed);
      setNewPlayer(false);
    }
  }, []);

  /** Persist player to sessionStorage */
  useEffect(() => {
    if (player.playerId || player.username) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    }
  }, [player]);

  /** Update username only (input binding) */
  const setUsername = (username: string) => {
    setPlayer((prev) => ({
      ...prev,
      username,
    }));
  };

  /**
   * Called on "Create Game"
   * - Generates playerId
   * - Saves username
   */
  const createGamePlayer = (username: string) => {
    const updatedPlayer: Player = {
      playerId: generatePlayerId(),
      username,
    };

    setPlayer(updatedPlayer);
    setNewPlayer(false);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
    return updatedPlayer;
  };

  /** Optional utility */
  const clearPlayer = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPlayer({ playerId: null, username: null });
    setNewPlayer(true);
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        newPlayer,
        setUsername,
        createGamePlayer,
        clearPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}
