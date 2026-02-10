"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";

import { useGame } from "@/context/GameContext";
import { useWebSocket } from "@/context/WebSocketContext";
import TeamSelection from "@/features/game/game-state/components/TeamSelection";
import PlayerSearch from "@/features/game/game-state/components/PlayerSearch";
import GameDown from "@/features/game/game-state/components/GameDown";
import GameAbandoned from "@/features/game/game-state/components/GameAbandoned";
import DefaultFallback from "@/features/game/game-state/components/DefaultFallback";
import { getGameStateNumber } from "@/features/game/game-state/constants";

const GAME_STATE: Record<number, React.ReactNode> = {
  2: <TeamSelection/>,
  3: <PlayerSearch/>,
  4: <GameDown/>,
  5: <GameAbandoned/>,
  1: <DefaultFallback/>,
}

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

  // RENDER LOGIC AND EARLY RETURN

   /* Use Memo is used to save up on computation every time the DOM re-renders cause of the small UI updates */
  const CurrentView = useMemo(()=>{

    const message = game?.broadcastingMessage || ""
    const stateNumber = getGameStateNumber(message)

    return GAME_STATE[stateNumber] || GAME_STATE[1]

  },[game?.broadcastingMessage]) 

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
 

  return (
     <>{CurrentView}</>
  );
}

export default GameRoom;
