"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useGamerTag } from "@/context";
import { gameApi } from "@/services/api";
import { HomeBackground } from "./HomeBackground";
import { UsernameInput } from "./UsernameInput";
import { GameButtons } from "./GameButtons";
import { HOME_CONTENT } from "../constants";

export function HomePage() {
  const router = useRouter();
  const { gamerTag, setGamerTag, player, isLoaded } = useGamerTag();
  const [error, setError] = useState<string>("");

  const createGameMutation = useMutation({
    mutationFn: gameApi.createGame,
    onSuccess: (game) => {
      // Navigate to lobby with game ID
      router.push(`/lobby/${game.gameId}`);
    },
    onError: (err) => {
      console.error("Failed to create game:", err);
      setError("Failed to create game. Please try again.");
    },
  });

  const handleCreateGame = () => {
    setError("");

    if (!gamerTag.trim()) {
      setError(HOME_CONTENT.usernameRequired);
      return;
    }

    if (!player) {
      setError("Player information not available");
      return;
    }

    createGameMutation.mutate(player);
  };

  const handleRandomGame = () => {
    // Disabled for now
    console.log("Random game - coming soon!");
  };

  const handleUsernameChange = (value: string) => {
    setGamerTag(value);
    if (error) setError("");
  };

  if (!isLoaded) {
    return (
      <HomeBackground>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-white text-xl font-body">
            Loading...
          </div>
        </div>
      </HomeBackground>
    );
  }

  return (
    <HomeBackground>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Main Content */}
        <div className="text-center max-w-2xl mx-auto">
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4 drop-shadow-lg">
            {HOME_CONTENT.title}
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl md:text-2xl font-heading text-white/90 mb-6">
            {HOME_CONTENT.subtitle}
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg font-body text-white/80 mb-10 leading-relaxed">
            {HOME_CONTENT.description}
          </p>

          {/* Username Input */}
          <div className="flex flex-col items-center gap-6">
            <UsernameInput
              value={gamerTag}
              onChange={handleUsernameChange}
              error={error}
              disabled={createGameMutation.isPending}
            />

            {/* Game Buttons */}
            <GameButtons
              onCreateGame={handleCreateGame}
              onRandomGame={handleRandomGame}
              isLoading={createGameMutation.isPending}
              isRandomDisabled={true}
            />
          </div>
        </div>
      </div>
    </HomeBackground>
  );
}
