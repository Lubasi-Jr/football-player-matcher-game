"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/context/GameContext'
import { usePlayer, Player } from '@/context/PlayerProvider'
import { useWebSocket } from '@/context/WebSocketContext'

type ReplayPayload = { gameId: string; player: Player }
type LeavePayload  = { gameId: string }

function GameDown() {
  const { game, gameId, clearGame } = useGame()
  const { player } = usePlayer()
  const { sendAction } = useWebSocket()
  const router = useRouter()
  const [replayRequested, setReplayRequested] = useState(false)

  const handleReplay = () => {
    if (replayRequested) return
    setReplayRequested(true)
    const payload: ReplayPayload = { gameId, player }
    sendAction("replay", payload)
  }

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
          <div className="flex gap-4 pt-2">
            {/* {replayRequested ? (
              <p className="text-white/60 text-sm">Waiting for opponent...</p>
            ) : (
              <button
                onClick={handleReplay}
                className="text-white bg-[#80461b] text-sm px-6 py-2 rounded-md cursor-pointer hover:bg-[#6b3a15] transition-colors"
              >
                Replay
              </button>
            )} */}
            <button
              onClick={handleBack}
              className="text-white border border-white text-sm px-6 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default GameDown
