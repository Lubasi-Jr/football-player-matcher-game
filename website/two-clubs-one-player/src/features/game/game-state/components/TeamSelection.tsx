"use client"
import { useGame } from '@/context/GameContext'
import { usePlayer } from '@/context/PlayerProvider'
import React from 'react'
import { Player } from '@/context/PlayerProvider'
import { useWebSocket } from '@/context/WebSocketContext'
import { useState } from 'react'
import { FootballTeamSelectionCards as cards } from '../constants'
import Image from 'next/image'



type TeamSelectionPayload  = {
  gameId: string,
  teamId: number,
  player: Player,
}

function TeamSelection() {
  const {game, gameId} = useGame();
  const {player} = usePlayer();
  const { sendAction } = useWebSocket();
  const [isDisabled, setIsDisabled] = useState<boolean>(false) // Flag to avoid duplicate button clicks
  const [selectedTeam, setSelectedTeam] = useState<number>(null)

  const handleTeamSelect = (teamId: string)=>{
    /* We only need teamId from the Team Card because gameId is from useGame, Player object is from usePlayer */
    // Make sure disabled is on - affects all buttons
    // Update the UI for the selected team
    // Draft the payload

    // Send the action - just wait for it to automatically re-render the message
  }
  return (
   <div className="relative z-10 min-h-screen w-full">
      <section id='game-message' className="w-full h-auto mb-7 px-6 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:px-12 text-center space-y-5 md:space-y-7">
          <h1 className="text-4xl font-bold text-white">2 Clubs 1 Player</h1>
          <p className="text-white">{`Broadcasting message is: ${game?.broadcastingMessage}`}</p>
          <p className="text-white">{`Player 1 is: ${game?.player1.username}`}</p>
          <p className="text-white">{`Player 2 is: ${game?.player2.username}`}</p>
        </div>
      </section>
      <section id='team-cards' className='w-full min-h-screen px-3 md:px-12 flex flex-col gap-1.5 md:grid md:grid-cols-3 md:grid-rows-2 md:gap-1.5'>
        {
          cards.map((card,index)=>(
            <div key={index} id={String(card.teamId)}
              className={`w-[220] px-2 h-[260] pb-2.5 flex gap-4 bg-white rounded-2xl`}
            >
              <div id='team-logo' className='rounded-lg relative w-full h-[200]'>
                 <Image src={card.src} fill alt='team-logo' className='object-cover' /> 
              </div>
              <button disabled={isDisabled} className={`text-white bg-[#80461b] border-0 text-center px-2 py-1 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 transition-opacity`}>
                Select
              </button>
            </div>
          ))
        }
      </section>
    </div>
  )
}

export default TeamSelection

/* Re-usable Team Card component */