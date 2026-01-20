import { Player } from "@/context/PlayerProvider";
import { creatGame } from "../services";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useCreateGame() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (player: Player) => {
      const { data, error } = await creatGame(player);
      if (error) throw error;
      return data as any;
    },
    onSuccess: (data) => {
      router.push(`/lobby/${data?.gameId}`);
    },
  });
}
