"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGamerTag } from "@/context";
import { LobbyPage } from "@/features/lobby";
import { Game } from "@/types";

export default function LobbyPageRoute() {
  const params = useParams();
  const router = useRouter();
  const { player, isLoaded, hasGamerTag } = useGamerTag();
  const [initialGame, setInitialGame] = useState<Game | undefined>();

  const gameId = params.gameId as string;

  useEffect(() => {
    if (isLoaded && !hasGamerTag) {
      // Redirect to home if no gamer tag
      router.push("/");
    }
  }, [isLoaded, hasGamerTag, router]);

  if (!isLoaded || !hasGamerTag) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl font-body animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return <LobbyPage gameId={gameId} initialGame={initialGame} />;
}
