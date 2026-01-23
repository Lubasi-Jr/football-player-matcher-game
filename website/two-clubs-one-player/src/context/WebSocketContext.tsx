// context/WebSocketContext.tsx
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
import { EMPTY_GAME, Game } from "@/types";
import { useGame } from "./GameContext";

interface WebSocketContextType {
  isConnected: boolean;
  sendAction: (destination: string, payload: any) => void;
  initializeConnection: (gameId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef<Client | null>(null);
  const { updateGame } = useGame();

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
          const updatedGame = JSON.parse(message.body) as Game;
          // Update the GameContext
          updateGame(updatedGame);
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
        destination: `/app/game/${destination}`,
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
    <WebSocketContext.Provider
      value={{ isConnected, sendAction, initializeConnection }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  return context;
};
