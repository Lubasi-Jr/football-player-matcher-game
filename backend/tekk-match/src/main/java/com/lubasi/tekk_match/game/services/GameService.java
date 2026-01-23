package com.lubasi.tekk_match.game.services;

import com.lubasi.tekk_match.footballer.models.Footballer;
import com.lubasi.tekk_match.game.Game;
import com.lubasi.tekk_match.game.enums.GameStatus;
import com.lubasi.tekk_match.game.exceptions.EmptyMatchmakingQueue;
import com.lubasi.tekk_match.game.exceptions.GameNotFoundException;
import com.lubasi.tekk_match.game.exceptions.InvalidGameException;
import com.lubasi.tekk_match.game.models.FootballerSelection;
import com.lubasi.tekk_match.game.models.Player;
import com.lubasi.tekk_match.game.models.Replay;
import com.lubasi.tekk_match.game.models.TeamSelection;
import com.lubasi.tekk_match.game.storage.GameReplay;
import com.lubasi.tekk_match.game.storage.GameStorage;
import com.lubasi.tekk_match.team.models.FootballTeam;
import com.lubasi.tekk_match.team.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;
import java.util.UUID;

@Service
public class GameService {
    private final GameStorage gameStorage;
    private final TeamRepository teamRepository;
    private final GameReplay gameReplay;
    private final Queue<Player> matchmaking = new LinkedList<>();

    @Autowired
    public GameService(GameStorage storage, TeamRepository teamRepository, GameReplay gameReplay){
        this.gameStorage = storage;
        this.teamRepository = teamRepository;
        this.gameReplay = gameReplay;
    }

    public Game createNewGame(Player player1){
        // Create a game for player 1 and return it. They will have the id to create the room URL
        String newGameID = UUID.randomUUID().toString();
        Game newGame = new Game(player1,newGameID);
        gameStorage.addGame(newGame);

        // Set up the replays for the game
        gameReplay.addNewReplay(newGameID);

        return newGame;
    }

    public Game syncGameWithPlayer(String gameId) throws GameNotFoundException{
        boolean gameExists = gameStorage.getGames().containsKey(gameId);
        if(!gameExists) throw new GameNotFoundException("Sorry, unfortunately this game does not exist");
        return gameStorage.getGames().get(gameId);
    }

    public Game joinGame(Player player2, String gameID) throws InvalidGameException, GameNotFoundException {
        // Retrieve the game from storage
        boolean gameExists = gameStorage.getGames().containsKey(gameID);
        if(!gameExists) throw new GameNotFoundException("Sorry, unfortunately this game does not exist");
        Game gameToJoin = gameStorage.getGames().get(gameID);
        if(!gameToJoin.getStatus().equals(GameStatus.NEW)) throw new InvalidGameException("Sorry, you can't join this game. It is full");
        gameToJoin.setPlayer2(player2);
        gameToJoin.setStatus(GameStatus.IN_PROGRESS);
        gameToJoin.setBroadcastingMessage("Please select the teams you wish to use");
        gameStorage.addGame(gameToJoin); // Update the details of the game that currently exists
        return gameToJoin;
    }

    public synchronized Game joinRandomGame(Player player2) throws EmptyMatchmakingQueue{
        matchmaking.add(player2);
        if(matchmaking.size() >= 2){
            Player playerOne = matchmaking.poll();
            Player playerTwo = matchmaking.poll();

            String newGameID = UUID.randomUUID().toString();
            Game newGame = new Game(playerOne,newGameID);
            newGame.setPlayer2(playerTwo);
            newGame.setStatus(GameStatus.IN_PROGRESS);
            gameStorage.addGame(newGame);

            // Set up the replays for the game
            gameReplay.addNewReplay(newGameID);

            return newGame; // Make sure to send it to the relevant subscribers
        }
        throw  new EmptyMatchmakingQueue("No available players at the moment");
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
                game.setTeamSelections(new ArrayList<>());
                game.setBroadcastingMessage("The teams selected are the same, please re-pick your teams once more");
                gameStorage.addGame(game); // REMEMBER TO UPDATE WITH BROADCASTING MESSAGE
                return game;
            }
            // If they are not equal, create a new Team selection for the player and update the game
            FootballTeam team = teamRepository.findById(teamToAddID).orElseThrow();
            TeamSelection newTeamSelection = new TeamSelection(player,team);
            currentTeamSelections.add(newTeamSelection);
            game.setShowClubs(true);

            game.setTeamSelections(currentTeamSelections);
            game.setBroadcastingMessage("The teams to match up are shown below. Quickly search for a valid footballer!!");
            gameStorage.addGame(game); // REMEMBER TO UPDATE WITH BROADCASTING MESSAGE

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

    public boolean isFootballerValid(Game game, Footballer footballer){
        if(game.getTeamSelections() == null || game.getTeamSelections().size() != 2){
            return false;
        }

        UUID ballersID = footballer.getFootballerId();
        Long teamID1 = game.getTeamSelections().get(0).getTeamSelected().getFootballTeamId();
        Long teamID2 = game.getTeamSelections().get(1).getTeamSelected().getFootballTeamId();

        boolean playedForTeam1 = teamRepository.footballerHasPlayedForTeam(ballersID,teamID1);
        boolean playedForTeam2 = teamRepository.footballerHasPlayedForTeam(ballersID,teamID2);

        return playedForTeam1 && playedForTeam2;
    }

    public Game addPlayerSelection(Footballer baller, String gameID, Player player){
        Game game = gameStorage.getGames().get(gameID);

        // 1. Check if game is already finished (i.e., someone else was faster)
        if (game.getStatus().equals(GameStatus.FINISHED) ||
                (game.getFootballerSelection() != null && !game.getFootballerSelection().isEmpty())) {

            // The game is already over. This player lost the race.
            // Just return the game in its finished state. The controller will
            // broadcast this, and the client will see someone else won.
            return game;
        }

        // 2. NEW: Validate the footballer selection
        if (!isFootballerValid(game, baller)) {
            // Invalid selection! The footballer didn't play for both teams.
            // The game continues. Return the game in its current (unchanged) state.
            // The player can try again.

            // You can update the broadcasting message to say "Player did not player for both [Team] and [Team]
            String ballerName = baller.getFootballerName();
            String message = ballerName+" did not play for both of these teams.";
            game.setBroadcastingMessage(message);
            return game;
        }

        // 3. If we're here, the selection is VALID and this player is the FIRST.
        // This player WINS!

        // Create a player selection
        FootballerSelection selection = new FootballerSelection(player,baller);
        // Check if current player selections includes something
        ArrayList<FootballerSelection> currentSelections = game.getFootballerSelection();
        if(!currentSelections.isEmpty()){
            // If it is not empty then this selection has lost
            return game;
        }
        // Else, player has won with this selection since it the first
        currentSelections.add(selection);
        game.setWinner(player);
        game.setFootballerSelection(currentSelections);
        game.setStatus(GameStatus.FINISHED); // If the round is finished, show the replay button
        // Update the broadcasting message
        String playerUsername = player.getUsername();
        String ballerName = baller.getFootballerName();
        String message = playerUsername+" "+"won this round. Their footballer selection was "+ballerName;
        game.setBroadcastingMessage(message);
        gameStorage.addGame(game);
        return game;

    }

    public Game replayRequest(String gameID, Player playerRequesting){
        Replay replay = gameReplay.addNewRequest(playerRequesting.getPlayerId(), gameID);
        Game game = gameStorage.getGames().get(gameID);

        if(replay.getReplayRequests().size() == 1){
            // Duplicate request OR The player is the first player to request
            String message = playerRequesting.getUsername() + " requested to play the next round";
            game.setBroadcastingMessage(message);
            return game; // Update the broadcasting message with "Waiting for all players to request next round"
        }
        // Since the size is 2, restart the game and return it to both players
        game.setStatus(GameStatus.IN_PROGRESS);
        game.setTeamSelections(new ArrayList<>());
        game.setFootballerSelection(new ArrayList<>());
        game.setWinner(null);
        game.setShowClubs(false);
        game.setBroadcastingMessage("Please select the teams you wish to use");
        return game;
    }


    public Game leaveGame(String gameID){
        // Game Abandoned, so in frontend the player who did not abandon the  gets navigated back to home
        Game abandonedGame = gameStorage.getGames().get(gameID);
        abandonedGame.setStatus(GameStatus.ABANDONED);
        abandonedGame.setBroadcastingMessage("This game has been abandoned");
        gameStorage.getGames().remove(abandonedGame.getGameId());
        gameReplay.getGameReplays().remove(abandonedGame.getGameId());
        return abandonedGame;
    }




}
