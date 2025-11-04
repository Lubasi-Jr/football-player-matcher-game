package com.lubasi.tekk_match.game.services;

import com.lubasi.tekk_match.game.Game;
import com.lubasi.tekk_match.game.enums.GameStatus;
import com.lubasi.tekk_match.game.exceptions.GameNotFoundException;
import com.lubasi.tekk_match.game.exceptions.InvalidGameException;
import com.lubasi.tekk_match.game.models.Player;
import com.lubasi.tekk_match.game.models.TeamSelection;
import com.lubasi.tekk_match.game.storage.GameStorage;
import com.lubasi.tekk_match.team.models.FootballTeam;
import com.lubasi.tekk_match.team.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.UUID;

@Service
public class GameService {
    private final GameStorage gameStorage;
    private final TeamRepository teamRepository;

    @Autowired
    public GameService(GameStorage storage, TeamRepository teamRepository){
        this.gameStorage = storage;
        this.teamRepository = teamRepository;
    }

    public Game createNewGame(Player player1){
        // Create a game for player 1 and return it. They will have the id to create the room URL
        String newGameID = UUID.randomUUID().toString();
        Game newGame = new Game(player1,newGameID);
        gameStorage.addGame(newGame);
        return newGame;
    }

    public Game joinGame(Player player2, String gameID) throws InvalidGameException, GameNotFoundException {
        // Retrieve the game from storage
        boolean gameExists = gameStorage.getGames().containsKey(gameID);
        if(!gameExists) throw new GameNotFoundException("Sorry, unfortunately this game does not exist");
        Game gameToJoin = gameStorage.getGames().get(gameID);
        if(!gameToJoin.getStatus().equals(GameStatus.NEW)) throw new InvalidGameException("Sorry, you can't join this game. It is full");
        gameToJoin.setPlayer2(player2);
        gameToJoin.setStatus(GameStatus.IN_PROGRESS);
        gameStorage.addGame(gameToJoin); // Update the details of the game that currently exists
        return gameToJoin;
    }

    public Game addTeamSelection(Long teamToAddID, String gameID, Player player){
        Game game = gameStorage.getGames().get(gameID);
        ArrayList<TeamSelection> currentTeamSelections = game.getTeamSelections();

        if(currentTeamSelections.size() == 1){
            // Retrieve the team that has already been picked
            Long pickedTeamID = currentTeamSelections.get(0)
                    .getTeamSelected()
                    .getFootballTeamId();
            if(pickedTeamID.equals(teamToAddID)){
                // Update the broadcasting message and return the game unchanged
                gameStorage.addGame(game); // REMEMBER TO UPDATE WITH BROADCASTING MESSAGE
                return game;
            }
            // If they are not equal, create a new Team selection for the player and update the game
            FootballTeam team = teamRepository.findById(teamToAddID).orElseThrow();
            TeamSelection newTeamSelection = new TeamSelection(player,team);
            currentTeamSelections.add(newTeamSelection);

            game.setTeamSelections(currentTeamSelections);
            gameStorage.addGame(game);

            return game;
        }

        // This is the first team selection being made
        FootballTeam team = teamRepository.findById(teamToAddID).orElseThrow();
        TeamSelection newTeamSelection = new TeamSelection(player,team);
        currentTeamSelections.add(newTeamSelection);

        game.setTeamSelections(currentTeamSelections);
        gameStorage.addGame(game);

        return game;
    }

    


}
