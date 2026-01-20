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
