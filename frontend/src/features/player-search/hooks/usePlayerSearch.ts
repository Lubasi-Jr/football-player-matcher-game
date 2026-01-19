import { useInfiniteQuery } from "@tanstack/react-query";
import { playerApi } from "@/services/api";
import { useDebounce } from "@/hooks";
import { SEARCH_CONFIG } from "@/constants";
import { Footballer } from "@/types";

interface UsePlayerSearchOptions {
  searchQuery: string;
  enabled?: boolean;
}

export function usePlayerSearch({
  searchQuery,
  enabled = true,
}: UsePlayerSearchOptions) {
  const debouncedQuery = useDebounce(searchQuery, SEARCH_CONFIG.DEBOUNCE_MS);

  const shouldFetch =
    enabled && debouncedQuery.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH;

  return useInfiniteQuery({
    queryKey: ["players", "search", debouncedQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const results = await playerApi.searchPlayers({
        searchQuery: debouncedQuery,
        page: pageParam,
        size: SEARCH_CONFIG.PAGE_SIZE,
      });
      return {
        data: results,
        nextPage:
          results.length === SEARCH_CONFIG.PAGE_SIZE
            ? pageParam + 1
            : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: shouldFetch,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
