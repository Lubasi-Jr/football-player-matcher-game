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
    private String broadcastingMessage;
    private Player player1;
    private Player player2;
    private Player winner;
    private ArrayList<FootballerSelection> footballerSelection;
    private ArrayList<TeamSelection> teamSelections;
    private boolean showClubs;

    public Game(Player player1, String newGameId){
        this.player1 = player1;
        this.footballerSelection = new ArrayList<>();
        this.teamSelections = new ArrayList<>();
        this.showClubs = false;
        this.status = GameStatus.NEW;
        this.gameId = newGameId;
        this.winner = null;
        this.broadcastingMessage = "";
    }


}
