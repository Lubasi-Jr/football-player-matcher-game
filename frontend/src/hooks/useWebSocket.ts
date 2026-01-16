import { useEffect, useRef, useCallback, useState } from "react";
import { webSocketService } from "@/services/websocket";
import { useGame } from "@/context";
import { Game, GameStatus } from "@/types";
import { WS_DESTINATIONS } from "@/constants";
import {
  TeamSelectionPayload,
  PlayerSelectionPayload,
  ReplayPayload,
  LeaveGamePayload,
} from "@/types";

interface UseWebSocketOptions {
  gameId: string;
  onGameUpdate?: (game: Game) => void;
  autoConnect?: boolean;
}

export function useWebSocket({
  gameId,
  onGameUpdate,
  autoConnect = true,
}: UseWebSocketOptions) {
  const { setGame } = useGame();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const hasConnected = useRef(false);

  const handleGameUpdate = useCallback(
    (game: Game) => {
      setGame(game);
      onGameUpdate?.(game);
    },
    [setGame, onGameUpdate]
  );

  const connect = useCallback(() => {
    if (hasConnected.current || !gameId) return;

    setIsConnecting(true);
    hasConnected.current = true;

    webSocketService.connect(
      gameId,
      handleGameUpdate,
      () => {
        setIsConnected(true);
        setIsConnecting(false);
      },
      () => {
        setIsConnected(false);
        setIsConnecting(false);
      }
    );
  }, [gameId, handleGameUpdate]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    hasConnected.current = false;
    setIsConnected(false);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && gameId && !hasConnected.current) {
      connect();
    }

    return () => {
      // Don't disconnect on unmount to maintain connection across re-renders
      // disconnect();
    };
  }, [autoConnect, gameId, connect]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // WebSocket action methods
  const selectTeam = useCallback((payload: TeamSelectionPayload) => {
    webSocketService.send(WS_DESTINATIONS.SELECT_TEAM, payload);
  }, []);

  const selectPlayer = useCallback((payload: PlayerSelectionPayload) => {
    webSocketService.send(WS_DESTINATIONS.SELECT_PLAYER, payload);
  }, []);

  const requestReplay = useCallback((payload: ReplayPayload) => {
    webSocketService.send(WS_DESTINATIONS.REPLAY, payload);
  }, []);

  const leaveGame = useCallback((payload: LeaveGamePayload) => {
    webSocketService.send(WS_DESTINATIONS.LEAVE, payload);
  }, []);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    selectTeam,
    selectPlayer,
    requestReplay,
    leaveGame,
  };
}
