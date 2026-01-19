"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useGamerTag, useGame } from "@/context";
import { gameApi } from "@/services/api";
import { GameRoom } from "@/features/game-room";
import { HomeBackground, UsernameInput } from "@/features/home";
import { Game } from "@/types";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { player, gamerTag, setGamerTag, isLoaded, hasGamerTag } =
    useGamerTag();
  const { game, setGame } = useGame();

  const gameId = params.gameId as string;
  const isJoining = searchParams.get("joining") === "true";

  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Join game mutation
  const joinGameMutation = useMutation({
    mutationFn: (playerData: { gameId: string; player: typeof player }) =>
      gameApi.joinGame(playerData.gameId, playerData.player!),
    onSuccess: (joinedGame) => {
      setGame(joinedGame);
      // Remove joining param from URL
      router.replace(`/game/${gameId}`);
    },
    onError: (error: any) => {
      console.error("Failed to join game:", error);
      if (error.status === 404) {
        setUsernameError("Game not found. It may have expired.");
      } else if (error.status === 400) {
        setUsernameError("This game is already full.");
      } else {
        setUsernameError("Failed to join game. Please try again.");
      }
    },
  });

  // Determine if we need to show username prompt
  useEffect(() => {
    if (isLoaded && isJoining && !hasGamerTag) {
      setShowUsernamePrompt(true);
    }
  }, [isLoaded, isJoining, hasGamerTag]);

  // Auto-join if player 2 has gamer tag
  useEffect(() => {
    if (isLoaded && isJoining && hasGamerTag && player && !game) {
      joinGameMutation.mutate({ gameId, player });
    }
  }, [isLoaded, isJoining, hasGamerTag, player, game, gameId]);

  // Handle username submit for player 2
  const handleUsernameSubmit = () => {
    if (!gamerTag.trim()) {
      setUsernameError("Please enter a gamertag");
      return;
    }

    if (player) {
      setShowUsernamePrompt(false);
      joinGameMutation.mutate({ gameId, player });
    }
  };

  // Show username prompt for joining player
  if (showUsernamePrompt) {
    return (
      <HomeBackground>
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-heading font-bold text-white mb-4">
              Enter Your Gamertag
            </h1>
            <p className="text-white/70 font-body mb-6">
              Choose a name to play with
            </p>

            <UsernameInput
              value={gamerTag}
              onChange={(value) => {
                setGamerTag(value);
                setUsernameError("");
              }}
              error={usernameError}
            />

            <button
              onClick={handleUsernameSubmit}
              disabled={joinGameMutation.isPending}
              className="btn-primary mt-4 w-full"
            >
              {joinGameMutation.isPending ? "Joining..." : "Join Game"}
            </button>
          </div>
        </div>
      </HomeBackground>
    );
  }

  // Loading state
  if (!isLoaded || joinGameMutation.isPending) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl font-body animate-pulse">
          {joinGameMutation.isPending ? "Joining game..." : "Loading..."}
        </div>
      </div>
    );
  }

  // Error state
  if (usernameError && !showUsernamePrompt) {
    return (
      <HomeBackground>
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <h1 className="text-3xl font-heading font-bold text-accent-red mb-4">
              Unable to Join
            </h1>
            <p className="text-white/80 font-body mb-6">{usernameError}</p>
            <button onClick={() => router.push("/")} className="btn-primary">
              Return Home
            </button>
          </div>
        </div>
      </HomeBackground>
    );
  }

  return <GameRoom gameId={gameId} initialGame={game || undefined} />;
}
