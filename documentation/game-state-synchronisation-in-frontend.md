# How This Frontend Ensures Game Data is Always Synchronized and Never Stale

## The Problem We're Solving

In a real-time two-player game, both clients must always reflect the same authoritative game state. A stale UI — where one player sees an old state — breaks the game entirely. The architecture addresses this across three threat vectors: network interruption, page refresh, and concurrent state updates.

---

## The Transport Layer: STOMP over SockJS

The bidirectional connection uses STOMP (Simple Text Oriented Messaging Protocol) on top of SockJS, implemented via `@stomp/stompjs`. SockJS provides a WebSocket-like API with automatic fallback to HTTP long-polling if the browser or network doesn't support WebSockets.

Each client subscribes to a game-specific channel as soon as the STOMP connection is established:

```typescript
client.subscribe(`/gameroom/${gameId}`, (message) => {
  const updatedGame = JSON.parse(message.body) as Game;
  updateGame(updatedGame);
});
```

The backend (Spring Boot) broadcasts the full, authoritative `Game` object to this channel after every state change. Clients never receive partial patches — they always receive the complete current truth. This eliminates any possibility of reconciliation bugs from missed or partially applied updates.

---

## The State Store: React Context with a Shallow Merge Strategy

Game state lives in `GameContext`. When a new `Game` object arrives from the server, it is merged into the existing state using a shallow spread:

```typescript
setGame((prev) => {
  if (!prev) return updatedGame;
  return { ...prev, ...updatedGame };
});
```

This Last-Write-Wins strategy means server data always overwrites client-held data, field by field. There is no local mutation logic that could diverge from the server — the server is the single source of truth, and every broadcast reinforces it.

---

## Preventing Stale State on Reconnection

The most dangerous stale state scenario is a dropped connection. The architecture handles this at two levels:

### 1. Heartbeats Detect Broken Connections Fast

Both the client and server send heartbeats every 4 seconds:

```typescript
heartbeatIncoming: 4000,
heartbeatOutgoing: 4000,
```

If a heartbeat is missed, the connection is flagged as dead and `reconnectDelay: 5000` triggers an automatic reconnection attempt within 5 seconds.

### 2. A `/sync` Call Re-hydrates State Immediately on Reconnect

The moment the STOMP client successfully re-establishes its connection, it publishes a sync request before any user action can occur:

```typescript
client.publish({
  destination: `/app/game/${gameId}/sync`,
  body: JSON.stringify({}),
});
```

The server responds by broadcasting the full current `Game` state. This means even if a player was offline for 30 seconds while their opponent selected a team, the reconnecting client receives the up-to-date state immediately — no manual refresh required.

---

## Preventing Stale State Across Page Refreshes

Navigating away and back, or accidentally refreshing, would normally destroy the in-memory state. This is solved by persisting the `gameId` to `sessionStorage`:

```typescript
sessionStorage.setItem("current_game_id", gameId);
```

On page load, the game route reads this value, re-initialises the STOMP connection with the correct `gameId`, and the `/sync` call immediately re-fetches the current server state. The player lands back in exactly the state the game is in — not the state it was in when they left.

---

## Optimistic Updates Without Stale Risk

For immediate UI feedback (e.g. disabling a button after a team is selected), the client applies optimistic local updates:

```typescript
const handleTeamSelect = (teamId: string) => {
  setIsDisabled(true);              // Immediate UI response
  sendAction("select-team", payload);  // Sent to server
};
```

The client never commits this as the final state — it only disables the control to prevent duplicate submissions. The server's authoritative broadcast overwrites local state and drives the actual transition to the next game phase. There is no risk of the optimistic update "sticking" in a wrong state because the server's response always wins.

---

## Cleanup on Page Unload

A `useLeaveGuard` hook listens for `pagehide` events (which fires more reliably than `beforeunload` on mobile browsers):

```typescript
window.addEventListener("pagehide", (e) => {
  if (!e.persisted) {
    sendAction("leave", { gameId });
    clearGame();
  }
});
```

This notifies the server that the player has left, so the other player is not left staring at a frozen "waiting" state. The server can then broadcast an updated `Game` state to the remaining client.

---

## How Game Phase is Determined

Rather than managing a separate client-side state machine, the UI renders based on a `broadcastingMessage` field in the `Game` object — a string set by the server. A utility function `getGameStateNumber()` maps this message to a numbered game phase, and the parent component conditionally renders `TeamSelection`, `PlayerSearch`, `GameDown`, or `GameAbandoned` accordingly.

Because this field is always sourced from the server broadcast, the two clients can never disagree on what phase the game is in.

---

## Summary

| Scenario | Solution |
|---|---|
| Network drops | Heartbeats detect it; auto-reconnect + `/sync` re-hydrates state |
| Page refresh | `sessionStorage` preserves `gameId`; `/sync` fetches fresh state on reload |
| Concurrent updates | Server is single source of truth; Last-Write-Wins shallow merge |
| Duplicate submissions | Optimistic UI disables controls; server broadcast confirms the transition |
| Player leaves | `pagehide` hook notifies server; other client receives updated state |

---

## Core Design Principle

> The client never owns the truth. It holds a cache of what the server last told it, and every connection event — initial connect, reconnect, or page load — immediately triggers a re-sync to ensure that cache is fresh.

### Key Files

| File | Responsibility |
|---|---|
| `WebSocketContext.tsx` | Connection management + channel subscription |
| `GameContext.tsx` | Merge strategy + `sessionStorage` persistence |
| `useLeaveGuard.ts` | Cleanup on page unload |
