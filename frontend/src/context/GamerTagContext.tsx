"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Player } from "@/types";
import { STORAGE_KEYS } from "@/constants";

interface GamerTagContextType {
  gamerTag: string;
  playerId: string;
  player: Player | null;
  setGamerTag: (tag: string) => void;
  isLoaded: boolean;
  hasGamerTag: boolean;
}

const GamerTagContext = createContext<GamerTagContextType | undefined>(
  undefined
);

interface GamerTagProviderProps {
  children: ReactNode;
}

export function GamerTagProvider({ children }: GamerTagProviderProps) {
  const [gamerTag, setGamerTagState] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTag = localStorage.getItem(STORAGE_KEYS.GAMER_TAG) || "";
      let storedId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);

      // Generate a new player ID if none exists
      if (!storedId) {
        storedId = uuidv4();
        localStorage.setItem(STORAGE_KEYS.PLAYER_ID, storedId);
      }

      setGamerTagState(storedTag);
      setPlayerId(storedId);
      setIsLoaded(true);
    }
  }, []);

  const setGamerTag = useCallback((tag: string) => {
    setGamerTagState(tag);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.GAMER_TAG, tag);
    }
  }, []);

  const player: Player | null =
    gamerTag && playerId
      ? {
          playerId,
          username: gamerTag,
        }
      : null;

  const value: GamerTagContextType = {
    gamerTag,
    playerId,
    player,
    setGamerTag,
    isLoaded,
    hasGamerTag: !!gamerTag,
  };

  return (
    <GamerTagContext.Provider value={value}>
      {children}
    </GamerTagContext.Provider>
  );
}

export function useGamerTag() {
  const context = useContext(GamerTagContext);
  if (context === undefined) {
    throw new Error("useGamerTag must be used within a GamerTagProvider");
  }
  return context;
}
