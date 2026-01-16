// Player type
export interface Player {
  playerId: string;
  username: string;
}

// Football Team type
export interface FootballTeam {
  footballTeamId: number;
  teamName: string;
  league: string;
  logoUrl?: string;
}

// Footballer type
export interface Footballer {
  footballerId: string;
  footballerName: string;
  position: string;
  nationality: string;
  flag: string;
  dob: string;
}

// Team Selection type
export interface TeamSelection {
  player: Player;
  teamSelected: FootballTeam;
}

// Footballer Selection type
export interface FootballerSelection {
  selectedBy: Player;
  validFootballer: Footballer;
  selectedAt: string;
}

// Game Status enum
export enum GameStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
  ABANDONED = "ABANDONED",
}

// Game type
export interface Game {
  gameId: string;
  status: GameStatus;
  broadcastingMessage: string;
  player1: Player | null;
  player2: Player | null;
  winner: Player | null;
  footballerSelection: FootballerSelection[];
  teamSelections: TeamSelection[];
  showClubs: boolean;
}

// Payload types for WebSocket messages
export interface TeamSelectionPayload {
  gameId: string;
  teamId: number;
  player: Player;
}

export interface PlayerSelectionPayload {
  gameId: string;
  footballer: Footballer;
  player: Player;
}

export interface ReplayPayload {
  gameId: string;
  player: Player;
}

export interface LeaveGamePayload {
  gameId: string;
}

// API Response types
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  hasNext: boolean;
}
