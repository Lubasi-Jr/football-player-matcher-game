package com.lubasi.tekk_match.game.models;

import com.lubasi.tekk_match.team.models.FootballTeam;
import lombok.Data;

@Data
public class TeamSelection {
    private Player player;
    private FootballTeam teamSelected;

    public TeamSelection(Player pl, FootballTeam team){
        this.player = pl;
        this.teamSelected = team;
    }
}
