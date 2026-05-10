"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/context/WebSocketContext";
import React from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { useLeaveGuard } from "@/hooks/useLeaveGuard";

function LobbyPage() {
  // HOOKS - Cutsom then Library
  const { game } = useGame();
  const { initializeConnection } = useWebSocket();
  const params = useParams<{ lobbyId: string }>();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  useLeaveGuard(params.lobbyId);

  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/join-game/${params.lobbyId}`
      : `/join-game/${params.lobbyId}`;

  // EFFECTS
  useEffect(() => {
    // Establish a websocket connection for this specific game
    initializeConnection(params.lobbyId);
  }, [params.lobbyId]);

  useEffect(() => {
    if (game?.player2) {
      // Player 2 just joined, route to the game room
      router.push(`/game/${game?.gameId}`);
    }
  }, [game, router]);

  // EVENT HANDLERS
  async function handleCopy() {
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // RENDER LOGIC- n/a
  return (
    <div className="relative z-10 min-h-screen w-full">
      <section className="w-full h-screen px-6 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:px-12 text-center space-y-5 md:space-y-7">
          <h1 className="text-4xl font-bold text-white">
            Waiting for player 2
          </h1>
          <p className="text-white">Share this link with Player 2</p>
          <div className="flex items-center gap-2 w-full max-w-lg">
            <p className="flex-1 bg-white/10 text-white text-sm px-4 py-2 rounded-lg truncate">
              {joinUrl}
            </p>
            <button
              onClick={handleCopy}
              className="shrink-0 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium transition-colors hover:bg-white/80"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LobbyPage;
