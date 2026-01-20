import { Player } from "@/context/PlayerProvider";

interface ApiSuccess {
  data: any;
  error: null;
}

interface ApiError {
  data: null;
  error: any;
}

type ApiResponse = ApiError | ApiSuccess;

export default async function joinGame(
  gameId: string,
  player2: Player,
): Promise<ApiResponse> {
  try {
    const url = `http://localhost:8080/api/game/join/${gameId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(player2),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}`,
      );
    }
    // No errors, data has been received
    const gameObject = await response.json();
    return { data: gameObject, error: null } as ApiSuccess;
  } catch (error) {
    return { data: null, error: error } as ApiError;
  }
}
