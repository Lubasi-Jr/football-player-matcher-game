import React from 'react'
import PropTypes from 'prop-types'
import { useGame } from '@/context/GameContext'
import SearchBar from '../../player-selection/components/SearchBar'
import { PlayerSelectionPayload } from '../../player-selection/constants'
import { useWebSocket } from '@/context/WebSocketContext'
import { FootballTeam } from '@/types'
import Image from 'next/image'

const TEAM_LOGO_PREFIX = "/teams/"
const imageFromTeamName: Record<string,string> = {
   "Liverpool": `${TEAM_LOGO_PREFIX}liverpool.png`,
   "Arsenal": `${TEAM_LOGO_PREFIX}arsenal.png`,
   "Chelsea": `${TEAM_LOGO_PREFIX}chelsea.png`,
   "Manchester United": `${TEAM_LOGO_PREFIX}man-united.png`,
   "Manchester City": `${TEAM_LOGO_PREFIX}man-city.png`,
   "Tottenham Hotspur": `${TEAM_LOGO_PREFIX}tottenham.png`,
}

function PlayerSearch() {
 
 const {game, gameId} = useGame()
 // FlatMap the game to obtain the teams selected
 const teamsSelected: FootballTeam[] = game.teamSelections.flatMap(ts => ts.teamSelected)
 const {sendAction} = useWebSocket()
 const DESTINATION = "select-player"
 const selectPlayer = (payload: PlayerSelectionPayload)=>{
      sendAction(DESTINATION,payload)
 }
   return (
    <div id='outer-shell' className="relative z-10 min-h-screen w-full flex flex-col justify-start items-center px-4 py-10">
       {/* Header */}
       <section className="w-full max-w-2xl text-center mb-10 space-y-3">
          <h1 className="text-4xl font-bold text-white drop-shadow-md">2 Clubs 1 Player</h1>
          <p className="text-white/90 text-base">{game?.broadcastingMessage}</p>
          <div className="flex justify-center gap-8 text-white/80 text-sm font-medium">
            <span>Player 1: <span className="text-white font-semibold">{game?.player1.username}</span></span>
            <span>Player 2: <span className="text-white font-semibold">{game?.player2.username}</span></span>
          </div>
       </section>
       {/* Teams selected */}
       <section className="w-full max-w-3xl grid grid-cols-2 gap-5 md:gap-6">
         {
            teamsSelected.map((card,index)=>(
               <div
                     key={index}
                     className={`
                        mx-auto w-full max-w-50 py-5 px-3
                        flex flex-col items-center justify-center gap-3
                      bg-white rounded-2xl shadow-lg
                        transition-transform hover:scale-105
                        `}
                           >
                             {/* Logo */}
                             <div className="relative w-35 h-35">
                               <Image src={imageFromTeamName[card.teamName]} fill alt={card.teamName} className="object-contain" />
                             </div>
               
                             {/* Team Name */}
                             <p className="text-gray-700 font-semibold text-sm text-center">{card.teamName}</p>
                           </div>
            ))
         }

       </section>
       <div id='container' className='w-full max-w-2xl flex flex-col gap-10'>
          {/* Search Bar Component */}
          <SearchBar selectPlayer={selectPlayer} />
       </div>
     </div>)
}



export default PlayerSearch

