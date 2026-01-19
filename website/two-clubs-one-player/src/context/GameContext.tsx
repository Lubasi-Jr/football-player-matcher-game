// context/GameContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface GameContextType {
  game: any; // Replace 'any' with your Game interface
  isConnected: boolean;
  sendAction: (destination: string, payload: any) => void;
  initializeConnection: (gameId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef<Client | null>(null);

  const initializeConnection = (gameId: string) => {
    if (stompClient.current?.connected) return;

    // Use SockJS if your Spring backend has .withSockJS() enabled
    const socket = new SockJS("http://localhost:8080/tekk");

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setIsConnected(true);
      console.log("Connected to STOMP");

      // Subscribe to the specific game room
      client.subscribe(`/gameroom/${gameId}`, (message) => {
        if (message.body) {
          const updatedGame = JSON.parse(message.body);
          setGame(updatedGame); // This updates the UI globally
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP error", frame.headers["message"]);
    };

    client.activate();
    stompClient.current = client;
  };

  const sendAction = (destination: string, payload: any) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: `/app/game${destination}`,
        body: JSON.stringify(payload),
      });
    } else {
      console.error("Cannot send message: STOMP client is not connected.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  return (
    <GameContext.Provider
      value={{ game, isConnected, sendAction, initializeConnection }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
