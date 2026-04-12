"use client"
import { useGame } from '@/context/GameContext'
import { usePlayer } from '@/context/PlayerProvider'
import React, { useState } from 'react'
import { Player } from '@/context/PlayerProvider'
import { useWebSocket } from '@/context/WebSocketContext'
import { FootballTeamSelectionCards as cards } from '../constants'
import { sameTeamsSelected } from '../constants'
import Image from 'next/image'

type TeamSelectionPayload = {
  gameId: string,
  teamId: number,
  player: Player,
}

const DESTINATION = "select-team"

function TeamSelection() {
  const { game, gameId } = useGame();
  const { player } = usePlayer();
  const { sendAction } = useWebSocket();
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)

  const handleTeamSelect = (teamId: string) => {
    setIsDisabled(true)
    setSelectedTeam(Number(teamId))
    const payload: TeamSelectionPayload = { gameId, teamId: Number(teamId), player };
    sendAction(DESTINATION, payload)
    setIsDisabled(false)
    
    if(game?.broadcastingMessage === sameTeamsSelected) {
      setIsDisabled(false);
      setSelectedTeam(null)
    }
  }

  return (
    <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-start pt-10 pb-16 px-4">
      
      {/* Header */}
      <section className="w-full max-w-2xl text-center mb-10 space-y-3">
        <h1 className="text-4xl font-bold text-white drop-shadow-md">2 Clubs 1 Player</h1>
        <p className="text-white/90 text-base">{game?.broadcastingMessage}</p>
        <div className="flex justify-center gap-8 text-white/80 text-sm font-medium">
          <span>Player 1: <span className="text-white font-semibold">{game?.player1.username}</span></span>
          <span>Player 2: <span className="text-white font-semibold">{game?.player2.username}</span></span>
        </div>
      </section>

      {/* Team Cards Grid */}
      <section className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
        {cards.map((card, index) => {
          const isSelected = selectedTeam === card.teamId;
          return (
            <div
              key={index}
              className={`
                mx-auto w-full max-w-50 py-5 px-3
                flex flex-col items-center justify-center gap-3
                bg-white rounded-2xl shadow-lg
                transition-transform hover:scale-105
                ${isSelected ? 'ring-4 ring-green-400 shadow-green-200' : ''}
              `}
            >
              {/* Logo */}
              <div className="relative w-35 h-35">
                <Image src={card.src} fill alt={card.name} className="object-contain" />
              </div>

              {/* Team Name */}
              <p className="text-gray-700 font-semibold text-sm text-center">{card.name}</p>

              {/* Select / Selected indicator */}
              {isSelected ? (
                <div className="relative w-8 h-8">
                  <Image src="/green-tick.webp" alt="selected" fill className="object-contain" />
                </div>
              ) : (
                <button
                  onClick={() => handleTeamSelect(String(card.teamId))}
                  disabled={isDisabled}
                  className="text-white bg-[#80461b] text-sm px-4 py-1.5 rounded-md
                             cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                             hover:bg-[#6b3a15] transition-colors"
                >
                  Select
                </button>
              )}
            </div>
          );
        })}
      </section>
    </div>
  )
}

export default TeamSelection