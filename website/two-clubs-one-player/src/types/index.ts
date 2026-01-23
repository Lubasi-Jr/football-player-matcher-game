import { Player } from "@/context/PlayerProvider";
import { UUID } from "crypto";

export type Game = {
  gameId: string;
  status: any;
  broadcastingMessage: string;
  player1: Player;
  player2: Player;
  winner: Player;
  footballerSelection: FootballerSelection[];
  teamSelections: TeamSelection[];
  showClubs: boolean;
};

export const EMPTY_GAME: Game = {
  gameId: "",
  status: "",
  broadcastingMessage: "",
  player1: { username: "", playerId: "" },
  player2: { username: "", playerId: "" },
  winner: { username: "", playerId: "" },
  footballerSelection: [],
  teamSelections: [],
  showClubs: false,
};

type FootballerSelection = {
  selectedBy: Player;
  validFootballer: Footballer;
  Instant: any;
};

type TeamSelection = {
  player: Player;
  teamSelected: FootballTeam;
};

type FootballTeam = {
  footballerId: UUID;
  footballerName: string;
  position: string;
  nationality: string;
  flag: string;
  dob: string;
};

type Footballer = {
  footballTeamId: any;
  teamName: string;
  league: string;
};

export function gameToString(game: Game): string {
  return `
Game {
  gameId: "${game.gameId}"
  status: "${game.status}"
  broadcastingMessage: "${game.broadcastingMessage}"

  player1: ${playerToString(game.player1)}
  player2: ${playerToString(game.player2)}
  winner: ${playerToString(game.winner)}

  footballerSelections: ${game.footballerSelection.length}
  teamSelections: ${game.teamSelections.length}
  showClubs: ${game.showClubs}
}
`.trim();
}

function playerToString(player: Player | null | undefined): string {
  if (!player) return "null";

  const username = player.username ?? "null";
  const playerId = player.playerId ?? "null";

  return `{ username: "${username}", playerId: "${playerId}" }`;
}
