"use client";
import { useParams } from "next/navigation";
import React from "react";
import { usePlayer } from "@/context/PlayerProvider";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWebSocket } from "@/context/WebSocketContext";
import { mutationInput } from "@/features/join-game/hooks";
import { useJoinGame } from "@/features/join-game/hooks";
import { ClipLoader } from "react-spinners";

function JoinGame() {
  // HOOKS
  const { createGamePlayer } = usePlayer();
  const { initializeConnection } = useWebSocket();
  const mutation = useJoinGame();

  const params = useParams<{ gameId: string }>();
  const usernameRef = useRef<HTMLInputElement>(null);

  // EFFECTS
  useEffect(() => {
    // Establish a websocket connection for this specific game
    initializeConnection(params.gameId);
  }, [params.gameId]);

  // HELPER FUNCTIONS- n/a

  // EVENT HANDLERS
  const handleJoinGame = () => {
    // Check if username is set
    if (!usernameRef.current?.value) return;
    // Create New Game Player
    const player2 = createGamePlayer(usernameRef.current.value);

    // Route to the lobby- can only route once we have received a game object
    const input: mutationInput = {
      gameId: params.gameId,
      player2: player2,
    };
    mutation.mutate(input);
  };

  // EARLY RETURNS- n/a

  // RENDER LOGIC
  const isLoading = mutation.isPending;
  const buttonName = isLoading ? (
    <ClipLoader
      color="#000000"
      loading={true}
      size={16}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  ) : (
    "Join Game"
  );

  return (
    <div className="relative z-10 min-h-screen w-full">
      <section className="w-full h-screen px-6 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:px-12 text-center space-y-5 md:space-y-7">
          <h1 className="text-4xl font-bold text-white">2 Clubs 1 Player</h1>
          <p className="text-white">
            The "2 Clubs 1 Player" game is a quick, fun football challenge where
            participants name two football clubs and one player who has played
            for both. Showcase your football knowledge under pressure in this
            rapid-fire, head-to-head trivia battle!
          </p>
          <input
            type="text"
            placeholder="Enter your username"
            ref={usernameRef}
            className="border-2 bg-white text-black text-center px-2 py-2 focus:ring-black rounded-md"
          />
          <button
            onClick={handleJoinGame}
            className="font-medium bg-white border-2 rounded-md text-center px-2 py-2 cursor-pointer"
          >
            {buttonName}
          </button>
        </div>
      </section>
    </div>
  );
}

export default JoinGame;
