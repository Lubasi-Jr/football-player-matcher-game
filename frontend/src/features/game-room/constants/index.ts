export const GAME_ROOM_CONTENT = {
  teamSelection: {
    title: "Select Your Team",
    subtitle:
      "Choose a football club secretly. Your opponent won't see your choice until both have selected.",
    waitingForOpponent: "Waiting for opponent to select...",
  },
  playerSearch: {
    title: "Find the Link!",
    subtitle:
      "Search for a footballer who has played for BOTH teams shown below.",
    searchPlaceholder: "Search for a footballer...",
  },
  roundFinished: {
    replayButton: "Play Again",
    leaveButton: "Leave Game",
    waitingForReplay: "Waiting for opponent to accept replay...",
  },
  abandoned: {
    title: "Game Abandoned",
    subtitle: "Your opponent has left the game.",
    homeButton: "Return Home",
  },
} as const;
