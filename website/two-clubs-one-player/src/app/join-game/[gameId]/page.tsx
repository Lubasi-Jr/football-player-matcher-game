"use client";
import { useParams } from "next/navigation";
import React from "react";
import { usePlayer } from "@/context/PlayerProvider";
import { useRef } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGame } from "@/context/GameContext";

function JoinGame() {
  const { createGamePlayer } = usePlayer();
  const usernameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { initializeConnection, game } = useGame();
  const params = useParams<{ gameId: string }>();

  // First useEffect is to establish a connection with the websocket (Data synchronisation)
  useEffect(() => {
    initializeConnection(params.gameId);
  }, [params.gameId]);

  // 2nd useEffect is for when the game receives an update that both players are available
  useEffect(() => {
    if (game?.player1.playerId && game?.player2.playerId) {
      router.push(`/game/${game?.gameId}`);
    }
  }, [game, router]);

  const handleJoinGame = () => {
    console.log(usernameRef.current?.value);

    // Check if username is set
    if (!usernameRef.current?.value) return;
    // Create New Game Player
    createGamePlayer(usernameRef.current.value);
    // Retrieve the player object and the gameId in order to call join game- this will trigger the useEffect to run because game will update
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
        </div>
      </section>
    </div>
  );
}

export default JoinGame;
