"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import React from "react";
import { useRouter } from "next/navigation";

function LobbyPage() {
  const { initializeConnection, game } = useGame();
  const params = useParams<{ lobbyId: string }>();
  const router = useRouter();

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
  return (
    <div className="relative z-10 min-h-screen w-full">
      <section className="w-full h-screen px-6 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:px-12 text-center space-y-5 md:space-y-7">
          <h1 className="text-4xl font-bold text-white">
            Waiting for player 2
          </h1>
          <p className="text-white">
            {`Please tell player 2 to visit "http://localhost:3000/join-game/${params.lobbyId}"`}
          </p>
        </div>
      </section>
    </div>
  );
}

export default LobbyPage;
