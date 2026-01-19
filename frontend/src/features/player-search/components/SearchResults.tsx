"use client";

import { useRef, useCallback, useEffect } from "react";
import { Footballer } from "@/types";
import { PlayerItem } from "./PlayerItem";

interface SearchResultsProps {
  results: Footballer[];
  searchQuery: string;
  onSelectPlayer: (footballer: Footballer) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
}

export function SearchResults({
  results,
  searchQuery,
  onSelectPlayer,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isLoading,
}: SearchResultsProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-white/60 font-body mt-2">Searching...</p>
      </div>
    );
  }

  if (searchQuery.length < 2) {
    return (
      <div className="py-8 text-center">
        <p className="text-white/60 font-body">
          Type at least 2 characters to search
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-white/60 font-body">No players found</p>
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto custom-scrollbar">
      {results.map((footballer) => (
        <PlayerItem
          key={footballer.footballerId}
          footballer={footballer}
          searchQuery={searchQuery}
          onSelect={onSelectPlayer}
        />
      ))}

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="h-4">
        {isFetchingNextPage && (
          <div className="py-2 text-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
