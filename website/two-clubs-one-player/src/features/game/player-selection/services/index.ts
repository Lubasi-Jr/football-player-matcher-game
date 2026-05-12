import { Footballer, PageResponse } from "../constants";
/*

        This service function is used to search for players from the Spring boot Backend

 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const ENDPOINT = "/api/players/search";


export async function searchForPlayers(query: string, page: number, size: number) {
    try {
        const response = await fetch(
            `${BASE_URL}${ENDPOINT}?searchQuery=${query}&page=${page}&size=${size}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
        )
        if (!response.ok) {
            throw new Error("A network error occurred while searching for players")
        }
        const data = await response.json() as PageResponse<Footballer>
        return { data, error: null }
    } catch (error: any) {
        return { data: null, error: error?.message || "An unknown error occurred" }
    }
}