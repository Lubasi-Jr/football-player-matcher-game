import React from 'react'
import PropTypes from 'prop-types'
import { useGame } from '@/context/GameContext'
import SearchBar from '../../player-selection/components/SearchBar'

function PlayerSearch() {
 const {game, gameId} = useGame()
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
       <div id='container' className='w-full max-w-2xl flex flex-col gap-10'>
          {/* Search Bar Component */}
          <SearchBar />
       </div>
     </div>)
}



export default PlayerSearch

