import { Player } from "@/context/PlayerProvider";

interface ApiError {
  data: any;
  error: null;
}

interface ApiSuccess {
  data: null;
  error: any;
}

type ApiResponse = ApiError | ApiSuccess;

export async function creatGame(player1: Player): Promise<ApiResponse> {
  const url = "http://localhost:8080/api/game/create";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(player1),
    });

    // Check for network errors
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}`,
      );
    }
    // Retrieve body of game object
    const gameObject = await response.json();
    return { data: gameObject, error: null } as ApiSuccess;
  } catch (error) {
    return { data: null, error: error } as ApiError;
  }
}
