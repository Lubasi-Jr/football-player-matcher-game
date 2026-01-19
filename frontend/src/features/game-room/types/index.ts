import { Game, Player, FootballTeam, Footballer } from "@/types";

export interface GameRoomProps {
  gameId: string;
}

export interface TeamCardProps {
  team: FootballTeam;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (team: FootballTeam) => void;
}

export interface GameHeaderProps {
  game: Game;
  currentPlayer: Player | null;
}

export type GamePhase =
  | "team-selection"
  | "player-search"
  | "round-finished"
  | "game-abandoned";
