import { Footballer } from "../constants";
import { searchForPlayers } from "../services";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PageResponse } from "../constants";


export const useSearchPlayers = (searchQuery: string, size: number) => {
    return useInfiniteQuery({
        queryKey: ["players", searchQuery],
        queryFn: async ({ pageParam = 0 }) => {
            const { data, error } = await searchForPlayers(searchQuery, pageParam, size)
            if (error) throw new Error(error)
            return data as PageResponse<Footballer>
        },
        getNextPageParam: (lastPage) => {
            // If hasNext is true, return the next page number, otherwise return undefined
            // Returning undefined tells TanStack there are no more pages to fetch
            return lastPage.hasNext ? lastPage.currentPage + 1 : undefined
        },
        initialPageParam: 0,
        enabled: searchQuery.length >= 2,
    })
}