import { FootballTeam } from "@/types";

// API endpoints
export const API_ENDPOINTS = {
  CREATE_GAME: "/api/game/create",
  JOIN_GAME: (gameId: string) => `/api/game/join/${gameId}`,
  JOIN_RANDOM: "/api/game/join-random",
  SEARCH_PLAYERS: "/api/players/search",
} as const;

// WebSocket destinations
export const WS_DESTINATIONS = {
  GAME_TOPIC: (gameId: string) => `/gameroom/${gameId}`,
  SELECT_TEAM: "/app/game/select-team",
  SELECT_PLAYER: "/app/game/select-player",
  REPLAY: "/app/game/replay",
  LEAVE: "/app/game/leave",
} as const;

// Broadcasting messages for conditional rendering
export const BROADCAST_MESSAGES = {
  SELECT_TEAMS: "Please select the teams you wish to use",
  SAME_TEAMS:
    "The teams selected are the same, please re-pick your teams once more",
  SHOW_CLUBS:
    "The teams to match up are shown below. Quickly search for a valid footballer!!",
  REPLAY_REQUESTED: (username: string) =>
    `${username} requested to play the next round`,
  ABANDONED: "This game has been abandoned",
} as const;

export const FOOTBALL_TEAMS: FootballTeam[] = [
  {
    footballTeamId: 1,
    teamName: "Liverpool",
    league: "Premier League",
    logoUrl: "/teams/liverpool.png",
  },
  {
    footballTeamId: 2,
    teamName: "Arsenal",
    league: "Premier League",
    logoUrl: "/teams/arsenal.png",
  },
  {
    footballTeamId: 3,
    teamName: "Chelsea",
    league: "Premier League",
    logoUrl: "/teams/chelsea.png",
  },
  {
    footballTeamId: 4,
    teamName: "Manchester United",
    league: "Premier League",
    logoUrl: "/teams/man-united.png",
  },
  {
    footballTeamId: 5,
    teamName: "Manchester City",
    league: "Premier League",
    logoUrl: "/teams/man-city.png",
  },
  {
    footballTeamId: 6,
    teamName: "Tottenham Hotspur",
    league: "Premier League",
    logoUrl: "/teams/tottenham.png",
  },
];

// Local storage keys
export const STORAGE_KEYS = {
  GAMER_TAG: "tekk_match_gamer_tag",
  PLAYER_ID: "tekk_match_player_id",
} as const;

// Search configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_MS: 300,
  PAGE_SIZE: 10,
  MIN_SEARCH_LENGTH: 2,
} as const;
