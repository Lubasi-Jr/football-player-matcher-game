import React from 'react'
import { useSearchPlayers } from '../hooks/useSearchPlayers'
import { useState, useEffect } from 'react'
import { Footballer } from '../constants'
import { PlayerSelectionPayload } from '../constants'
import { useRef } from 'react'


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
        <div>
            <input
                value={draftSearch}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search players..."
            />
            {isLoading && <p>Searching...</p>}
            {footballers.map(f => (
                <div key={f.footballerId}>{f.footballerName}</div>
            ))}
            <div ref={sentinelRef} style={{ height: "1px" }} />
            {isFetchingNextPage && <p>Loading more...</p>}
        </div>
    )
}

export default SearchBar
