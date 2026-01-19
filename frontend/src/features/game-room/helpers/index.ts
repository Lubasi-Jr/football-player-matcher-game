import { Game, GameStatus, Player } from "@/types";
import { GamePhase } from "../types";
import { BROADCAST_MESSAGES } from "@/constants";

export function determineGamePhase(game: Game): GamePhase {
  // Check if game is abandoned
  if (game.status === GameStatus.ABANDONED) {
    return "game-abandoned";
  }

  // Check if round is finished
  if (game.status === GameStatus.FINISHED) {
    return "round-finished";
  }

  // Check if we're in player search phase (both teams selected, showClubs is true)
  if (game.showClubs && game.teamSelections.length === 2) {
    return "player-search";
  }

  // Default to team selection
  return "team-selection";
}

export function isCurrentPlayerWinner(
  game: Game,
  currentPlayer: Player | null,
): boolean {
  if (!game.winner || !currentPlayer) return false;
  return game.winner.playerId === currentPlayer.playerId;
}

export function getOpponent(
  game: Game,
  currentPlayer: Player | null,
): Player | null {
  if (!currentPlayer) return null;

  if (game.player1?.playerId === currentPlayer.playerId) {
    return game.player2;
  }
  return game.player1;
}

export function hasCurrentPlayerSelectedTeam(
  game: Game,
  currentPlayer: Player | null,
): boolean {
  if (!currentPlayer) return false;
  return game.teamSelections.some(
    (selection) => selection.player.playerId === currentPlayer.playerId,
  );
}
