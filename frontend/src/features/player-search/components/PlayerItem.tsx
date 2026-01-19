"use client";

import Image from "next/image";
import { Footballer } from "@/types";

interface PlayerItemProps {
  footballer: Footballer;
  searchQuery: string;
  onSelect: (footballer: Footballer) => void;
}

export function PlayerItem({
  footballer,
  searchQuery,
  onSelect,
}: PlayerItemProps) {
  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-bold text-accent-red">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <button
      onClick={() => onSelect(footballer)}
      className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-colors duration-200 text-left"
    >
      {/* Flag */}
      <div className="relative w-8 h-6 flex-shrink-0">
        {footballer.flag ? (
          <Image
            src={footballer.flag}
            alt={footballer.nationality}
            fill
            className="object-cover rounded"
          />
        ) : (
          <div className="w-full h-full bg-white/20 rounded" />
        )}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-body truncate">
          {highlightMatch(footballer.footballerName, searchQuery)}
        </p>
        <p className="text-white/60 font-body text-xs truncate">
          {footballer.position} • {footballer.nationality}
        </p>
      </div>
    </button>
  );
}
