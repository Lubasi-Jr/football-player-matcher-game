import { Game, Player, Footballer } from "@/types";
import { API_ENDPOINTS } from "@/constants";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `HTTP error! status: ${response.status}`
    );
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

// Game API
export const gameApi = {
  createGame: async (player: Player): Promise<Game> => {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CREATE_GAME}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });
    return handleResponse<Game>(response);
  },

  joinGame: async (gameId: string, player: Player): Promise<Game> => {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.JOIN_GAME(gameId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(player),
      }
    );
    return handleResponse<Game>(response);
  },

  joinRandomGame: async (player: Player): Promise<Game> => {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.JOIN_RANDOM}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });
    return handleResponse<Game>(response);
  },
};

// Player Search API
export interface SearchPlayersParams {
  searchQuery: string;
  page: number;
  size: number;
}

export const playerApi = {
  searchPlayers: async ({
    searchQuery,
    page,
    size,
  }: SearchPlayersParams): Promise<Footballer[]> => {
    const params = new URLSearchParams({
      searchQuery,
      page: page.toString(),
      size: size.toString(),
    });

    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.SEARCH_PLAYERS}?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return handleResponse<Footballer[]>(response);
  },
};
