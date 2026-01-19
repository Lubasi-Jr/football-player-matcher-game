"use client";

import { useState, useMemo } from "react";
import { Footballer } from "@/types";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
import { usePlayerSearch } from "../hooks/usePlayerSearch";

interface PlayerSearchProps {
  onSelectPlayer: (footballer: Footballer) => void;
}

export function PlayerSearch({ onSelectPlayer }: PlayerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePlayerSearch({ searchQuery });

  // Flatten paginated results
  const results = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  return (
    <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        isLoading={isLoading}
      />

      {/* Search Results */}
      <div className="mt-4">
        <SearchResults
          results={results}
          searchQuery={searchQuery}
          onSelectPlayer={onSelectPlayer}
          hasNextPage={hasNextPage || false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
