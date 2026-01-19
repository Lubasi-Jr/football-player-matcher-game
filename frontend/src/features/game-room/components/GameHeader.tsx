"use client";

import { Game, Player } from "@/types";
import { getOpponent } from "../helpers";

interface GameHeaderProps {
  game: Game;
  currentPlayer: Player | null;
}

export function GameHeader({ game, currentPlayer }: GameHeaderProps) {
  const opponent = getOpponent(game, currentPlayer);

  return (
    <div className="w-full bg-primary/50 backdrop-blur-sm py-4 px-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Current Player */}
        <div className="text-left">
          <p className="text-xs text-white/60 font-body">You</p>
          <p className="text-lg font-heading text-white">
            {currentPlayer?.username || "Unknown"}
          </p>
        </div>

        {/* VS */}
        <div className="text-center">
          <span className="text-2xl font-heading font-bold text-accent-red">
            VS
          </span>
        </div>

        {/* Opponent */}
        <div className="text-right">
          <p className="text-xs text-white/60 font-body">Opponent</p>
          <p className="text-lg font-heading text-white">
            {opponent?.username || "Waiting..."}
          </p>
        </div>
      </div>

      {/* Broadcasting Message */}
      {game.broadcastingMessage && (
        <div className="max-w-4xl mx-auto mt-3">
          <p className="text-center text-sm font-body text-white/80 bg-white/10 rounded-lg py-2 px-4">
            {game.broadcastingMessage}
          </p>
        </div>
      )}
    </div>
  );
}
