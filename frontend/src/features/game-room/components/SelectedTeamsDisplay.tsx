"use client";

import Image from "next/image";
import { TeamSelection } from "@/types";

interface SelectedTeamsDisplayProps {
  teamSelections: TeamSelection[];
}

export function SelectedTeamsDisplay({
  teamSelections,
}: SelectedTeamsDisplayProps) {
  if (teamSelections.length !== 2) return null;

  return (
    <div className="flex items-center justify-center gap-8 mb-6">
      {teamSelections.map((selection, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-xl p-4">
            {selection.teamSelected.logoUrl ? (
              <Image
                src={selection.teamSelected.logoUrl}
                alt={selection.teamSelected.teamName}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-3xl font-heading text-white">
                  {selection.teamSelected.teamName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <p className="mt-2 text-white font-heading text-sm">
            {selection.teamSelected.teamName}
          </p>
          <p className="text-white/60 font-body text-xs">
            Selected by {selection.player.username}
          </p>
        </div>
      ))}
    </div>
  );
}
