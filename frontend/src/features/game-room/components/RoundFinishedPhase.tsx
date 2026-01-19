"use client";

import { Game, Player } from "@/types";
import { SelectedTeamsDisplay } from "./SelectedTeamsDisplay";
import { GAME_ROOM_CONTENT } from "../constants";
import { isCurrentPlayerWinner } from "../helpers";

interface RoundFinishedPhaseProps {
  game: Game;
  currentPlayer: Player | null;
  onReplay: () => void;
  onLeave: () => void;
  hasRequestedReplay: boolean;
}

export function RoundFinishedPhase({
  game,
  currentPlayer,
  onReplay,
  onLeave,
  hasRequestedReplay,
}: RoundFinishedPhaseProps) {
  const isWinner = isCurrentPlayerWinner(game, currentPlayer);
  const winningSelection = game.footballerSelection[0];

  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Result Header */}
      <div className="text-center mb-8">
        <h2
          className={`text-4xl md:text-5xl font-heading font-bold mb-2 ${
            isWinner ? "text-green-400" : "text-accent-red"
          }`}
        >
          {isWinner ? "You Win! 🎉" : "You Lost! 😔"}
        </h2>
        {game.winner && (
          <p className="text-white/80 font-body text-lg">
            {game.winner.username} won this round!
          </p>
        )}
      </div>

      {/* Winning Selection */}
      {winningSelection && (
        <div className="bg-white/10 rounded-xl p-6 mb-8 text-center">
          <p className="text-white/60 font-body text-sm mb-2">
            Winning Player:
          </p>
          <p className="text-2xl font-heading text-white">
            {winningSelection.validFootballer.footballerName}
          </p>
          <p className="text-white/60 font-body text-sm mt-1">
            {winningSelection.validFootballer.nationality} •{" "}
            {winningSelection.validFootballer.position}
          </p>
        </div>
      )}

      {/* Teams Display */}
      <SelectedTeamsDisplay teamSelections={game.teamSelections} />

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onReplay}
          disabled={hasRequestedReplay}
          className={`btn-primary ${
            hasRequestedReplay ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {hasRequestedReplay
            ? GAME_ROOM_CONTENT.roundFinished.waitingForReplay
            : GAME_ROOM_CONTENT.roundFinished.replayButton}
        </button>
        <button onClick={onLeave} className="btn-secondary">
          {GAME_ROOM_CONTENT.roundFinished.leaveButton}
        </button>
      </div>
    </div>
  );
}
