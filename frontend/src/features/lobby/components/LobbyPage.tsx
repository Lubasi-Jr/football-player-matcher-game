"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGame, useGamerTag } from "@/context";
import { useWebSocket } from "@/hooks/useWebSocket";
import { HomeBackground } from "@/features/home";
import { ShareableLink } from "./ShareableLink";
import { WaitingIndicator } from "./WaitingIndicator";
import { LOBBY_CONTENT } from "../constants";
import { Game, GameStatus } from "@/types";

interface LobbyPageProps {
  gameId: string;
  initialGame?: Game;
}

export function LobbyPage({ gameId, initialGame }: LobbyPageProps) {
  const router = useRouter();
  const { game, setGame } = useGame();
  const { player } = useGamerTag();

  // Set initial game if provided
  useEffect(() => {
    if (initialGame) {
      setGame(initialGame);
    }
  }, [initialGame, setGame]);

  // Handle game updates
  const handleGameUpdate = useCallback(
    (updatedGame: Game) => {
      console.log("Lobby received game update:", updatedGame);

      // Check if player 2 has joined (game is in progress)
      if (
        updatedGame.status === GameStatus.IN_PROGRESS &&
        updatedGame.player1 &&
        updatedGame.player2
      ) {
        // Navigate to game room
        router.push(`/game/${gameId}`);
      }
    },
    [gameId, router],
  );

  // Connect to WebSocket
  const { isConnected, isConnecting } = useWebSocket({
    gameId,
    onGameUpdate: handleGameUpdate,
    autoConnect: true,
  });

  const handleCancel = () => {
    // Navigate back to home
    router.push("/");
  };

  return (
    <HomeBackground>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            {LOBBY_CONTENT.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg font-body text-white/80 mb-8">
            {LOBBY_CONTENT.subtitle}
          </p>

          {/* Connection Status */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-body ${
                isConnected
                  ? "bg-green-500/20 text-green-400"
                  : isConnecting
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected
                    ? "bg-green-400"
                    : isConnecting
                      ? "bg-yellow-400 animate-pulse"
                      : "bg-red-400"
                }`}
              />
              {isConnected
                ? "Connected"
                : isConnecting
                  ? "Connecting..."
                  : "Disconnected"}
            </span>
          </div>

          {/* Shareable Link */}
          <div className="mb-8">
            <ShareableLink gameId={gameId} />
          </div>

          {/* Waiting Indicator */}
          <div className="mb-8">
            <WaitingIndicator />
          </div>

          {/* Player Info */}
          {player && (
            <p className="text-white/60 font-body text-sm mb-6">
              Playing as: <span className="text-white">{player.username}</span>
            </p>
          )}

          {/* Cancel Button */}
          <button onClick={handleCancel} className="btn-secondary">
            {LOBBY_CONTENT.cancelButton}
          </button>
        </div>
      </div>
    </HomeBackground>
  );
}
