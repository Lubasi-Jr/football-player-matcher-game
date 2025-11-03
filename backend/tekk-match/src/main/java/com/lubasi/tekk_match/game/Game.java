package com.lubasi.tekk_match.game;


import com.lubasi.tekk_match.footballer.models.Footballer;
import com.lubasi.tekk_match.game.enums.GameStatus;
import com.lubasi.tekk_match.game.models.FootballerSelection;
import com.lubasi.tekk_match.game.models.Player;
import com.lubasi.tekk_match.game.models.TeamSelection;
import lombok.Data;

import java.util.ArrayList;
import java.util.UUID;

@Data
public class Game {
    private String gameId;
    private GameStatus status;
    private Player player1;
    private Player player2;
    private ArrayList<FootballerSelection> footballerSelection;
    private ArrayList<TeamSelection> teamSelections;
    private boolean showClubs;

    public Game(Player player1){
        this.player1 = player1;
        this.footballerSelection = new ArrayList<>();
        this.teamSelections = new ArrayList<>();
        this.showClubs = false;
        this.status = GameStatus.NEW;
        this.gameId = UUID.randomUUID().toString();
    }

    public void addTeamSelection(TeamSelection selection){
        // Should update the future game message attribute
        this.teamSelections.add(selection);
        if(this.teamSelections.size() > 1){
            // Check if teams are the same
            boolean sameTeams = this.teamSelections.get(0)
                    .getTeamSelected()
                    .getFootballTeamId()
                    .equals(this.teamSelections.get(1).getTeamSelected().getFootballTeamId());
            if(sameTeams){
                // Update broadcast message to say that the teams are equal
                // Empty the List to allow for new team entries
                this.teamSelections.clear();
            }
            // All teams are select and are different. Ready to reveal them
            this.showClubs = true;
            // New broadcast message: The teams revealed are as follows. Select your players quickly!!
        }
        // This is the first team selection made. Message should be "Waiting for all players to select their teams"

    }

}
