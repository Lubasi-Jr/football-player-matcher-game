"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/context/GameContext'
import { useWebSocket } from '@/context/WebSocketContext'

type LeavePayload = { gameId: string }

function GameAbandoned() {
  const { game, gameId, clearGame } = useGame()
  const { sendAction } = useWebSocket()
  const router = useRouter()

  const handleBack = () => {
    const payload: LeavePayload = { gameId }
    sendAction("leave", payload)
    clearGame()
    router.push("/")
  }

  return (
    <div className="relative z-10 min-h-screen w-full">
      <section className="w-full h-screen px-6 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:px-12 text-center space-y-5 md:space-y-7">
          <h1 className="text-4xl font-bold text-white">2 Clubs 1 Player</h1>
          <p className="text-white">{`${game?.broadcastingMessage}`}</p>
          <button
            onClick={handleBack}
            className="text-white border border-white text-sm px-6 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </section>
    </div>
  )
}

export default GameAbandoned
