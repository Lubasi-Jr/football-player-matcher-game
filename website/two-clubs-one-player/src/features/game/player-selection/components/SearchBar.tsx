import React from 'react'
import { useSearchPlayers } from '../hooks/useSearchPlayers'
import { useState, useEffect } from 'react'
import { Footballer } from '../constants'
import { PlayerSelectionPayload } from '../constants'


const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    // draftSearch tracks every keystroke in real-time.
    // searchQuery is the debounced version — only updated after the user stops typing.
    // useSearchPlayers depends on searchQuery, not draftSearch, so API calls
    // are only triggered once the user has paused rather than on every keystroke.
    const [draftSearch, setDraft] = useState<string>("")
    const {data, isLoading} = useSearchPlayers(searchQuery, 0, 10)
    

    useEffect(()=>{
        // Debounced search - useSearchPlayers is dependant on the searchQuery NOT draftSearch 
        const timer = setTimeout(()=>{
            setSearchQuery(draftSearch)
        },500)

        return ()=> clearTimeout(timer)

    },[draftSearch]) // Draft search gets updated with every keystroke - setDraft((e.target.value))
  return (
    <div>
      <p>
        
      </p>
    </div>
  )
}

export default SearchBar
