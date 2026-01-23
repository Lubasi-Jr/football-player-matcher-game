"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

import { useGame } from "@/context/GameContext";
import { useWebSocket } from "@/context/WebSocketContext";

function GameRoom() {
  // HOOKS
  const { game, gameId } = useGame();
  const { sendAction, initializeConnection, isConnected } = useWebSocket();
  const params = useParams<{ gameId: string }>();

  // EFFECTS
  /* Controls the window refresh. Refreshing the window loses connection therefore we need to reconnect and sync the game again */
  useEffect(() => {
    const idToUse = params.gameId || gameId;
    if (idToUse && !isConnected) {
      initializeConnection(idToUse);
    }
  }, [gameId, params.gameId, isConnected]);

  // HELPERS

  // EVENT HANDLERS

  // EARLY RETURNS

  if (!game)
    return (
      <>
        <div className="relative z-10 min-h-screen w-full">
          <section className="w-full h-screen px-6 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:px-12 text-center space-y-5 md:space-y-7">
              <h1 className="text-4xl font-bold text-white">
                2 Clubs 1 Player
              </h1>
              <p className="text-white">Waiting for Game to load...</p>
            </div>
          </section>
        </div>
      </>
    );

  // RENDER LOGIC
  /* Determine the game status and hence render accordingly with the helper function. Depends on the game broadcasting message */
  /* Use Memo is used to save up on computation every time the DOM re-renders cause of the small UI updates */

  return (
    <div className="relative z-10 min-h-screen w-full">
      <section className="w-full h-screen px-6 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:px-12 text-center space-y-5 md:space-y-7">
          <h1 className="text-4xl font-bold text-white">2 Clubs 1 Player</h1>
          <p className="text-white">Game has started !!!</p>
          <p className="text-white">{`Broadcasting message is: ${game?.broadcastingMessage}`}</p>
          <p className="text-white">{`Player 1 is: ${game?.player1.username}`}</p>
          <p className="text-white">{`Player 2 is: ${game?.player2.username}`}</p>
        </div>
      </section>
    </div>
  );
}

export default GameRoom;
