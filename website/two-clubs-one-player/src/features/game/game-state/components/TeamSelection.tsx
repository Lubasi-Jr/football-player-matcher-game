import { useGame } from '@/context/GameContext'
import React from 'react'
import { useWebSocket } from '@/context/WebSocketContext'

function TeamSelection() {
  const {game, gameId} = useGame()
  const { sendAction } = useWebSocket();
  return (
   <div className="relative z-10 min-h-screen w-full">
      <section className="w-full h-screen px-6 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:px-12 text-center space-y-5 md:space-y-7">
          <h1 className="text-4xl font-bold text-white">2 Clubs 1 Player</h1>
          <p className="text-white">{`Broadcasting message is: ${game?.broadcastingMessage}`}</p>
          <p className="text-white">{`Player 1 is: ${game?.player1.username}`}</p>
          <p className="text-white">{`Player 2 is: ${game?.player2.username}`}</p>
        </div>
      </section>
    </div>
  )
}

export default TeamSelection
