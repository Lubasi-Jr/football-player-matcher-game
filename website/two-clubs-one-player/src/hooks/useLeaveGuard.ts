import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { useWebSocket } from "@/context/WebSocketContext";

export function useLeaveGuard(gameId: string | null | undefined) {
  const { clearGame } = useGame();
  const { sendAction } = useWebSocket();

  useEffect(() => {
    if (!gameId) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handlePageHide = (e: PageTransitionEvent) => {
      if (!e.persisted) {
        sendAction("leave", { gameId });
        clearGame();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [gameId, sendAction, clearGame]);
}
