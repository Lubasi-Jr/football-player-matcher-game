# 2 Clubs 1 Player

A real-time multiplayer football trivia game where two players compete to name footballers who have played for specific clubs. Built with Next.js and WebSocket technology for instant synchronization.

## Table of Contents

- [Overview](#overview)
- [Game Rules](#game-rules)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Game Flow](#game-flow)
- [Features](#features)
- [Development](#development)
- [Backend Requirements](#backend-requirements)

## Overview

"2 Clubs 1 Player" is a fast-paced, head-to-head football trivia challenge where participants compete to name players who have played for two specific clubs. The game tests football knowledge under pressure in rapid-fire rounds with real-time synchronization between players.

## Game Rules

1. **Setup**: Two players enter usernames and connect to the same game room
2. **Team Selection**: Each player selects a football club
3. **Challenge**: Players race to name a footballer who has played for both selected clubs
4. **Validation**: The system validates whether the named player actually played for both teams
5. **Rounds**: Winners can request additional rounds to continue the competition
6. **Victory**: First to name a valid player wins the round

## Tech Stack

### Frontend
- **Framework**: Next.js 16.1.3 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Data Fetching**: TanStack Query (React Query) v5
- **WebSocket**: STOMP.js + SockJS Client
- **UI Components**: React Spinners
- **Code Quality**: ESLint 9

### Backend (Required Separately)
- Spring Boot WebSocket server
- STOMP protocol implementation
- Endpoint: `http://localhost:8080/tekk`

## Architecture

The application uses a client-server architecture with WebSocket-based real-time communication:

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │   Context    │  │   Features   │      │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤      │
│  │ / (Home)     │  │ GameContext  │  │ home/        │      │
│  │ /lobby       │  │ PlayerProv.  │  │ join-game/   │      │
│  │ /join-game   │  │ WebSocketCtx │  │ game/        │      │
│  │ /game        │  └──────────────┘  └──────────────┘      │
│  └──────────────┘                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │ WebSocket (STOMP/SockJS)
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              Backend (Spring Boot)                           │
├─────────────────────────────────────────────────────────────┤
│  • Game State Management                                     │
│  • Player Validation                                         │
│  • Footballer Database                                       │
│  • Real-time Broadcasting                                    │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

#### Contexts
- **GameContext**: Manages global game state, synchronization, and session persistence
- **PlayerProvider**: Handles player identity with UUID generation and session storage
- **WebSocketContext**: Manages STOMP WebSocket connections, subscriptions, and message publishing

#### State Management
- Game state persists in sessionStorage for refresh recovery
- Automatic reconnection and game state synchronization on page refresh
- Real-time updates broadcast to all connected players

## Project Structure

```
two-clubs-one-player/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Home page (Create game)
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── lobby/[lobbyId]/          # Waiting room for player 2
│   │   ├── join-game/[gameId]/       # Player 2 join page
│   │   └── game/[gameId]/            # Active game room
│   │
│   ├── context/                      # React Context providers
│   │   ├── GameContext.tsx           # Game state management
│   │   ├── PlayerProvider.tsx        # Player identity & session
│   │   └── WebSocketContext.tsx      # WebSocket connection
│   │
│   ├── features/                     # Feature-based modules
│   │   ├── home/                     # Home page logic
│   │   │   ├── components/           # Home UI components
│   │   │   ├── hooks/                # useCreateGame hook
│   │   │   └── services/             # API calls
│   │   ├── join-game/                # Join game logic
│   │   │   ├── hooks/                # useJoinGame hook
│   │   │   └── services/             # API calls
│   │   └── game/                     # Game room logic
│   │       └── game-state/
│   │           └── constants/        # Game state constants
│   │
│   ├── providers/                    # Provider composition
│   │   └── ReactQueryProvider.tsx    # TanStack Query setup
│   │
│   └── types/                        # TypeScript type definitions
│       └── index.ts                  # Game, Player, Team types
│
├── public/                           # Static assets
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.js                # Tailwind CSS config
├── next.config.ts                    # Next.js configuration
└── README.md                         # This file
```

## Prerequisites

- **Node.js**: 20.x or higher
- **npm/yarn/pnpm/bun**: Latest version
- **Backend Server**: Spring Boot WebSocket server running on `http://localhost:8080`

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2. Start the Backend Server

Ensure your Spring Boot backend is running with WebSocket support:
- Endpoint: `http://localhost:8080/tekk`
- Must support STOMP over SockJS
- Required endpoints:
  - `/app/game/{gameId}/sync` - Game state synchronization
  - `/gameroom/{gameId}` - Game room subscription

### 3. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

## Game Flow

### 1. Create Game
- Player 1 enters username on home page
- Clicks "Create Game"
- System generates unique game ID and player ID
- Redirects to lobby with shareable join link

### 2. Join Game
- Player 2 receives join link from Player 1
- Enters username
- Joins the game room
- Both players redirected to game page

### 3. Active Game
- **Team Selection Phase**: Players select football clubs
- **Validation**: System checks if teams are different
- **Challenge Phase**: Race to name a valid footballer
- **Result Phase**: Winner announced, option to play again
- **Abandonment**: Game can be abandoned by either player

### Game States
1. **Waiting**: Lobby waiting for Player 2
2. **Team Selection**: "Please select the teams you wish to use"
3. **Challenge**: "Quickly search for a valid footballer!!"
4. **Round Result**: Winner announcement and next round prompt
5. **Abandoned**: Game ended prematurely

## Features

### Real-time Synchronization
- Instant WebSocket updates via STOMP
- Automatic reconnection with state recovery
- Session persistence across page refreshes

### Player Management
- UUID-based player identification
- Session storage for player persistence
- Username validation

### Game Management
- Unique game IDs for each match
- Multi-round support
- Player validation and turn management
- Team selection with duplicate prevention

### UI/UX
- Loading states with spinners
- Responsive design (mobile-friendly)
- Clean, centered layout
- Real-time status updates

## Development

### Key Technologies

#### TanStack Query (React Query)
Used for server state management with mutations for:
- Creating games (`useCreateGame`)
- Joining games (`useJoinGame`)
- Automatic loading and error states

#### WebSocket Communication
```typescript
// Subscribe to game room
client.subscribe(`/gameroom/${gameId}`, (message) => {
  const updatedGame = JSON.parse(message.body);
  updateGame(updatedGame);
});

// Send action to server
sendAction(`game/${gameId}/action`, payload);
```

#### Session Persistence
```typescript
// Player persists across refreshes
sessionStorage.setItem("player", JSON.stringify(player));

// Game ID persists for reconnection
sessionStorage.setItem("current_game_id", gameId);
```

### Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build optimized production bundle
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `BackgroundImage.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCreateGame.ts`)
- **Contexts**: PascalCase with Context/Provider suffix
- **Types**: PascalCase (e.g., `Game`, `Player`)
- **Pages**: lowercase `page.tsx` (Next.js convention)

## Backend Requirements

The frontend expects a Spring Boot backend with the following:

### WebSocket Configuration
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/tekk")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/gameroom");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
```

### Expected Endpoints

#### Create Game
- **POST** `/api/games/create`
- **Body**: `{ playerId: string, username: string }`
- **Response**: `{ gameId: string, ... }`

#### Join Game
- **POST** `/api/games/{gameId}/join`
- **Body**: `{ playerId: string, username: string }`
- **Response**: `Game` object

#### Game Synchronization
- **WebSocket** `/app/game/{gameId}/sync`
- Triggers full game state broadcast

#### Game Room Subscription
- **WebSocket** `/gameroom/{gameId}`
- Broadcasts game updates to all subscribed clients

### Game Object Structure
```typescript
{
  gameId: string;
  status: string;
  broadcastingMessage: string;
  player1: { username: string, playerId: string };
  player2: { username: string, playerId: string };
  winner: Player;
  footballerSelection: FootballerSelection[];
  teamSelections: TeamSelection[];
  showClubs: boolean;
}
```

## Known Issues & Future Improvements

### Current Limitations
- Hardcoded backend URL (`localhost:8080`) - needs environment variable
- No error boundaries for runtime errors
- Missing input validation feedback
- No copy-to-clipboard for lobby URLs
- Repeated UI code across routes (needs shared layout component)
- Missing keyboard shortcuts (Enter to submit)
- No loading states on some routes
- useEffect dependency warnings

### Planned Enhancements
- Environment-based configuration
- Error boundaries and fallback UI
- Form validation with error messages
- Accessibility improvements (ARIA labels, keyboard navigation)
- Component library for shared UI elements
- Unit and integration tests
- Animation and transitions
- Player statistics and leaderboards
- Match history
- Multiple concurrent games per player

## Contributing

1. Follow the existing code organization (features, context, types)
2. Use TypeScript for type safety
3. Follow ESLint rules
4. Test WebSocket connections thoroughly
5. Ensure mobile responsiveness

## License

Private project - All rights reserved

## Support

For issues, questions, or contributions, please contact the project maintainers.

---

Built with Next.js and TypeScript for lightning-fast real-time gameplay.
