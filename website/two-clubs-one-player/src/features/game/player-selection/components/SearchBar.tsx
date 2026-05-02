import React from 'react'
import { useSearchPlayers } from '../hooks/useSearchPlayers'
import { useState, useEffect } from 'react'
import { Footballer } from '../constants'
import { PlayerSelectionPayload } from '../constants'
import { useRef } from 'react'
import Image from 'next/image'

type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'
const PositionMapper: Record<Position,string> = {
    Goalkeeper: "GK",
    Defender: "DEF",
    Midfielder: "MID",
    Forward: "FWD"
}

/* Player card component */
type PlayerSelectorProps = {
    baller: Footballer
}
export const PlayerSelector = ({baller}: PlayerSelectorProps)=>{
    return <div className='w-full 
    h-12 py-1.5 
    border-0 gap-4 flex items-center px-1 rounded-md bg-white text-black 
    hover:bg-black hover:text-white transition-colours hover:cursor-pointer'>
        <div id='flag' className='relative w-10 h-8'>
            <Image src={baller.flag} alt='players national flag' fill className='object-contain'/>
        </div>
        <p id='position' className='w-12 h-8'>{PositionMapper[baller.position]}</p>
        <p id='name' className='flex-1 truncate min-w-0'>{baller.footballerName}</p>
    </div>
}


const SearchBar = () => {
    const [draftSearch, setDraft] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const sentinelRef = useRef<HTMLDivElement>(null)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useSearchPlayers(searchQuery, 10)

    const footballers = data?.pages.flatMap(page => page.content) ?? []

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(draftSearch), 400)
        return () => clearTimeout(timer)
    }, [draftSearch])

    // Intersection Observer
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver((entries) => {
            const first = entries[0]
            if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        })

        observer.observe(sentinel)
        return () => observer.disconnect()

    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <>
            <input
                value={draftSearch}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search for players..."
                className='w-full py-2 px-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-black/55 border-2 border-white'
            />
            <div id='player-selectors-container'
                className='w-full bg-white max-h-72 overflow-y-scroll border-0 rounded-b-md no-scrollbar'
            >
                {
                    isLoading ? <p className='mx-auto'>Searching...</p> : <>
                    {footballers.map((baller, index) =>(
                        <>
                        <PlayerSelector key={baller.footballerId} baller={baller}/>
                        
                        </>
                    ))}
                    </>
                }
                <div  ref={sentinelRef} className="h-0 w-full opacity-0 pointer-events-none" />
                {isFetchingNextPage && <p>Loading more...</p>}
            </div>    
        </>
    )
}

export default SearchBar
