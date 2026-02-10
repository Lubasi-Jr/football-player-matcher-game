import TeamSelection from "../components/TeamSelection";

// Constants
const selectTeams = "Please select the teams you wish to use";
const sameTeamsSelected =
  "The teams selected are the same, please re-pick your teams once more";
const searchForPlayers =
  "The teams to match up are shown below. Quickly search for a valid footballer!!";

const abandoned = "This game has been abandoned";

// Logic to determine the state
export const getGameStateNumber = (message: string): number => {
  if (!message || message === "") return 1;
  if (message === selectTeams || message === sameTeamsSelected) return 2; // Select teams component
  if (message === searchForPlayers) return 3; // Player search component

  // State 4: Wildcard/Dynamic match
  if (message.includes(" did not play for both of these teams.")) {
    return 3;
  }

  if (
    message.includes("won this round. Their footballer selection was ") ||
    message.includes("requested to play the next round")
  )
    return 4; // Aftermatch of game component (Replay feature)

  if (message === abandoned) return 5; // Game abondoned- go back

  return 1; // Default fallback
};


