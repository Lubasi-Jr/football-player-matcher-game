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

function JoinGame() {
  const { createGamePlayer, player } = usePlayer();
  const { initializeConnection } = useWebSocket();
  const params = useParams<{ gameId: string }>();
  const usernameRef = useRef<HTMLInputElement>(null);
  const mutation = useJoinGame();

  useEffect(() => {
    // Establish a websocket connection for this specific game
    initializeConnection(params.gameId);
  }, [params.gameId]);

  const handleJoinGame = () => {
    // Check if username is set
    if (!usernameRef.current?.value) return;
    // Create New Game Player
    createGamePlayer(usernameRef.current.value);
    const hardCodedPlayer2 = {
      username: usernameRef.current.value,
      playerId: "329438749238",
    };
    // Route to the lobby- can only route once we have received a game object
    const input: mutationInput = {
      gameId: params.gameId,
      player2: hardCodedPlayer2,
    };
    mutation.mutate(input);
  };
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
            Join Game
          </button>
        </div>
      </section>
    </div>
  );
}

export default JoinGame;
