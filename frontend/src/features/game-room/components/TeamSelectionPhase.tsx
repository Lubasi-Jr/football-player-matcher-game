"use client";

import { useState } from "react";
import { Game, Player, FootballTeam } from "@/types";
import { TeamCard } from "./TeamCard";
import { FOOTBALL_TEAMS } from "@/constants";
import { GAME_ROOM_CONTENT } from "../constants";
import { hasCurrentPlayerSelectedTeam } from "../helpers";

interface TeamSelectionPhaseProps {
  game: Game;
  currentPlayer: Player | null;
  onSelectTeam: (team: FootballTeam) => void;
}

export function TeamSelectionPhase({
  game,
  currentPlayer,
  onSelectTeam,
}: TeamSelectionPhaseProps) {
  const [selectedTeam, setSelectedTeam] = useState<FootballTeam | null>(null);
  const hasSelected = hasCurrentPlayerSelectedTeam(game, currentPlayer);

  const handleSelectTeam = (team: FootballTeam) => {
    if (hasSelected) return;

    setSelectedTeam(team);
    onSelectTeam(team);
  };

  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
        {GAME_ROOM_CONTENT.teamSelection.title}
      </h2>
      <p className="text-white/70 font-body text-center max-w-lg mb-8">
        {GAME_ROOM_CONTENT.teamSelection.subtitle}
      </p>

      {/* Team Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-2xl">
        {FOOTBALL_TEAMS.map((team) => (
          <TeamCard
            key={team.footballTeamId}
            team={team}
            isSelected={selectedTeam?.footballTeamId === team.footballTeamId}
            isDisabled={hasSelected}
            onSelect={handleSelectTeam}
          />
        ))}
      </div>

      {/* Waiting message */}
      {hasSelected && (
        <div className="mt-8 text-center">
          <p className="text-white/80 font-body animate-pulse">
            {GAME_ROOM_CONTENT.teamSelection.waitingForOpponent}
          </p>
        </div>
      )}
    </div>
  );
}
