import { Player } from "@/context/PlayerProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import joinGame from "../services";
import { useGame } from "@/context/GameContext";

export type mutationInput = {
  gameId: string;
  player2: Player;
};

export function useJoinGame() {
  const router = useRouter();
  const { updateGame } = useGame();

  return useMutation({
    mutationFn: async (input: mutationInput) => {
      const { data, error } = await joinGame(input.gameId, input.player2);
      if (error) return error;
      return data as any;
    },
    onSuccess: (data) => {
      updateGame(data);
      router.push(`/game/${data?.gameId}`);
    },
  });
}
