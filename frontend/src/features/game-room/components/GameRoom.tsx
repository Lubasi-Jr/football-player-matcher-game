"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame, useGamerTag } from "@/context";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Game, GameStatus, FootballTeam, Footballer } from "@/types";
import { WS_DESTINATIONS } from "@/constants";
import { GameHeader } from "./GameHeader";
import { TeamSelectionPhase } from "./TeamSelectionPhase";
import { PlayerSearchPhase } from "./PlayerSearchPhase";
import { RoundFinishedPhase } from "./RoundFinishedPhase";
import { GameAbandonedPhase } from "./GameAbandonedPhase";
import { determineGamePhase } from "../helpers";

interface GameRoomProps {
  gameId: string;
  initialGame?: Game;
}

export function GameRoom({ gameId, initialGame }: GameRoomProps) {
  const router = useRouter();
  const { game, setGame } = useGame();
  const { player } = useGamerTag();
  const [hasRequestedReplay, setHasRequestedReplay] = useState(false);

  // Set initial game
  useEffect(() => {
    if (initialGame) {
      setGame(initialGame);
    }
  }, [initialGame, setGame]);

  // Handle game updates
  const handleGameUpdate = useCallback((updatedGame: Game) => {
    console.log("Game room received update:", updatedGame);

    // Reset replay request state when game restarts
    if (
      updatedGame.status === GameStatus.IN_PROGRESS &&
      !updatedGame.showClubs
    ) {
      setHasRequestedReplay(false);
    }

    // Handle abandoned game
    if (updatedGame.status === GameStatus.ABANDONED) {
      // Game will show abandoned phase
    }
  }, []);

  // WebSocket connection
  const { isConnected, selectTeam, selectPlayer, requestReplay, leaveGame } =
    useWebSocket({
      gameId,
      onGameUpdate: handleGameUpdate,
      autoConnect: true,
    });

  // Handle team selection
  const handleSelectTeam = useCallback(
    (team: FootballTeam) => {
      if (!player || !game) return;

      selectTeam({
        gameId: game.gameId,
        teamId: team.footballTeamId,
        player,
      });
    },
    [player, game, selectTeam],
  );

  // Handle player selection
  const handleSelectPlayer = useCallback(
    (footballer: Footballer) => {
      if (!player || !game) return;

      selectPlayer({
        gameId: game.gameId,
        footballer,
        player,
      });
    },
    [player, game, selectPlayer],
  );

  // Handle replay request
  const handleReplay = useCallback(() => {
    if (!player || !game || hasRequestedReplay) return;

    setHasRequestedReplay(true);
    requestReplay({
      gameId: game.gameId,
      player,
    });
  }, [player, game, hasRequestedReplay, requestReplay]);

  // Handle leave game
  const handleLeave = useCallback(() => {
    if (!game) return;

    leaveGame({ gameId: game.gameId });
    router.push("/");
  }, [game, leaveGame, router]);

  // Handle browser close/navigate away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (game) {
        leaveGame({ gameId: game.gameId });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [game, leaveGame]);

  // Loading state
  if (!game) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl font-body animate-pulse">
          Loading game...
        </div>
      </div>
    );
  }

  const gamePhase = determineGamePhase(game);

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <GameHeader game={game} currentPlayer={player} />

      {/* Connection Status */}
      <div className="flex justify-center py-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-body ${
            isConnected ? "text-green-400" : "text-red-400"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400 animate-pulse"
            }`}
          />
          {isConnected ? "Live" : "Reconnecting..."}
        </span>
      </div>

      {/* Game Content based on phase */}
      <div className="pb-8">
        {gamePhase === "team-selection" && (
          <TeamSelectionPhase
            game={game}
            currentPlayer={player}
            onSelectTeam={handleSelectTeam}
          />
        )}

        {gamePhase === "player-search" && (
          <PlayerSearchPhase
            game={game}
            currentPlayer={player}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {gamePhase === "round-finished" && (
          <RoundFinishedPhase
            game={game}
            currentPlayer={player}
            onReplay={handleReplay}
            onLeave={handleLeave}
            hasRequestedReplay={hasRequestedReplay}
          />
        )}

        {gamePhase === "game-abandoned" && <GameAbandonedPhase />}
      </div>
    </div>
  );
}
