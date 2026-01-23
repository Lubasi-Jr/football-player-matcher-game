"use client";
import { usePlayer } from "@/context/PlayerProvider";
import { useCreateGame } from "@/features/home/hooks";
import { ClipLoader } from "react-spinners";
import { useRef } from "react";
import { Player } from "@/context/PlayerProvider";

export default function Home() {
  // HOOKS - Custom then Imported
  const { createGamePlayer } = usePlayer();
  const mutation = useCreateGame();
  const usernameRef = useRef<HTMLInputElement>(null);

  // EFFECTS- N/A

  // HELPERS- N/A

  // EVENT HANDLERS
  const handleCreateGame = () => {
    // Check if username is set
    if (!usernameRef.current?.value) return;
    // Create New Game Player
    const player1: Player = createGamePlayer(usernameRef.current.value);
    // Route to the lobby- can only route once we have received a game object
    mutation.mutate(player1);
  };

  // EARLY RETURNS- N/A

  // RENDER LOGIC e.g disabled buttons
  const isLoading = mutation.isPending;
  const buttonName = mutation.isPending ? (
    <ClipLoader
      color="#000000"
      loading={true}
      size={16}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  ) : (
    "Create Game"
  );
  return (
    <div className="relative z-10 min-h-screen w-full">
      <section className="w-full h-screen px-6 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:px-12 text-center space-y-5 md:space-y-7">
          <h1 className="text-4xl font-bold text-white">2 Clubs 1 Player</h1>
          <p className="text-white">
            The "2 Clubs 1 Player" game is a quick, fun football challenge where
            participants name two football clubs and one player who has played
            for both. Showcase your football knowledge under pressure in this
            rapid-fire, head-to-head trivia battle!
          </p>
          <input
            type="text"
            placeholder="Enter your username"
            ref={usernameRef}
            className="border-2 bg-white text-black text-center px-2 py-2 focus:ring-black rounded-md"
          />
          <button
            disabled={mutation.isPending}
            onClick={handleCreateGame}
            className={`font-medium bg-white border-2 rounded-md text-center px-2 py-2 cursor-pointer min-w-[140] ${isLoading && "cursor-not-allowed"}`}
          >
            {buttonName}
          </button>
        </div>
      </section>
    </div>
  );
}
