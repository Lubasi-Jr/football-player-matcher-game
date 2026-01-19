"use client";

import { Game, Player, Footballer } from "@/types";
import { SelectedTeamsDisplay } from "./SelectedTeamsDisplay";
import { PlayerSearch } from "@/features/player-search";
import { GAME_ROOM_CONTENT } from "../constants";

interface PlayerSearchPhaseProps {
  game: Game;
  currentPlayer: Player | null;
  onSelectPlayer: (footballer: Footballer) => void;
}

export function PlayerSearchPhase({
  game,
  currentPlayer,
  onSelectPlayer,
}: PlayerSearchPhaseProps) {
  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
        {GAME_ROOM_CONTENT.playerSearch.title}
      </h2>
      <p className="text-white/70 font-body text-center max-w-lg mb-8">
        {GAME_ROOM_CONTENT.playerSearch.subtitle}
      </p>

      {/* Selected Teams Display */}
      <SelectedTeamsDisplay teamSelections={game.teamSelections} />

      {/* Player Search Component */}
      <div className="w-full max-w-xl">
        <PlayerSearch onSelectPlayer={onSelectPlayer} />
      </div>
    </div>
  );
}
