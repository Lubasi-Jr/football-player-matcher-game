"use client";

import { useRouter } from "next/navigation";
import { GAME_ROOM_CONTENT } from "../constants";

export function GameAbandonedPhase() {
  const router = useRouter();

  const handleReturnHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-accent-red mb-4">
          {GAME_ROOM_CONTENT.abandoned.title}
        </h2>
        <p className="text-white/80 font-body text-lg mb-8">
          {GAME_ROOM_CONTENT.abandoned.subtitle}
        </p>
        <button onClick={handleReturnHome} className="btn-primary">
          {GAME_ROOM_CONTENT.abandoned.homeButton}
        </button>
      </div>
    </div>
  );
}
