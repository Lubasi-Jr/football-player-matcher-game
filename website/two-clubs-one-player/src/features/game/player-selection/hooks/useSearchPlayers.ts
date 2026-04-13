import { Footballer } from "../constants";
import { searchForPlayers } from "../services";
import { useQuery } from "@tanstack/react-query";


export const useSearchPlayers = (searchQuery: string, page: number, size: number) =>{
    return useQuery({
        queryKey: ["players", searchQuery, page, size],
        queryFn: async () => {
            const {data, error} = await searchForPlayers(searchQuery, page, size)
            if(error){
                throw new Error(error)
            }
            return data || [] as Footballer[]
           
        },
        enabled: searchQuery.length >= 2,
        
    })
}