"use client";

import Image from "next/image";
import { FootballTeam } from "@/types";

interface TeamCardProps {
  team: FootballTeam;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (team: FootballTeam) => void;
  showSelection?: boolean;
}

export function TeamCard({
  team,
  isSelected,
  isDisabled,
  onSelect,
  showSelection = false,
}: TeamCardProps) {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect(team);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        team-card relative bg-white/10 rounded-xl p-4 flex flex-col items-center gap-3
        ${isSelected ? "selected" : ""}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/20"}
        ${showSelection && isSelected ? "ring-4 ring-green-500" : ""}
      `}
    >
      {/* Team Logo */}
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        {team.logoUrl ? (
          <Image
            src={team.logoUrl}
            alt={team.teamName}
            fill
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-heading text-white">
              {team.teamName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Team Name */}
      <p className="text-white font-heading text-sm md:text-base text-center">
        {team.teamName}
      </p>

      {/* Selection Indicator */}
      {isSelected && !showSelection && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-accent-red rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
}
