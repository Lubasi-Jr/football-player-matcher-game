package com.lubasi.tekk_match.services;


import com.lubasi.tekk_match.game.Game;
import com.lubasi.tekk_match.game.enums.GameStatus;
import com.lubasi.tekk_match.game.exceptions.GameNotFoundException;
import com.lubasi.tekk_match.game.exceptions.InvalidGameException;
import com.lubasi.tekk_match.game.models.Player;
import com.lubasi.tekk_match.game.services.GameService;
import com.lubasi.tekk_match.game.storage.GameReplay;
import com.lubasi.tekk_match.game.storage.GameStorage;
import com.lubasi.tekk_match.team.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

@ExtendWith(MockitoExtension.class)
public class GameInitiationServiceTests {
    @Mock
    private GameStorage gameStorage;
    @Mock
    private TeamRepository teamRepository;
    @Mock
    private GameReplay gameReplay;
    @Mock
    private Queue<Player> matchmaking = new LinkedList<>();

    @InjectMocks
    private GameService gameService;

    @Test
    public void GameService_CreateNewGame_ReturnsNewGame(){
        // Mock new player
        Player player1 = Player.builder().username("Lubs020").playerId("123").build();
        // No need to when() the game storage and game replay because they both return void. However, you can verify if they were called exactly once
        Game newGame = gameService.createNewGame(player1);
        // Assert: Game is not null, has a gameID and player 1 is in the game
        assertNotNull(newGame);
        assertNotNull(newGame.getGameId());
        assertEquals(newGame.getPlayer1(),player1);

        // Verify that the functions were called once
        verify(gameStorage, times(1)).addGame(newGame);
    }

    @Test
    public void GameService_JoinGame_ReturnsUpdatedGameWithPlayers() throws Exception{
        // ARRANGE
        // Mock a list of games
        Player playerGame1 = Player.builder().username("Lubs020").playerId("123").build();
        Player playerGame2 = Player.builder().username("Mills010").playerId("456").build();
        Player playerGame3 = Player.builder().username("Mysterio619").playerId("789").build();

        String EXISTING_GAME_ID = "12345-abcde";

        Map<String,Game> mockGameMap = new HashMap<>();

        Game game1 = new Game(playerGame1, EXISTING_GAME_ID);
        Game game2 = new Game(playerGame2, UUID.randomUUID().toString());
        Game game3 = new Game(playerGame3, UUID.randomUUID().toString());

        mockGameMap.put(game1.getGameId(), game1);
        mockGameMap.put(game2.getGameId(), game2);
        mockGameMap.put(game3.getGameId(), game3);

        // When for gameStorage contains ID and for get Game
        when(gameStorage.getGames().containsKey(EXISTING_GAME_ID)).thenReturn(true);
        when(gameStorage.getGames().get(EXISTING_GAME_ID)).thenReturn(mockGameMap.get(EXISTING_GAME_ID));

        // ACT
        Player player2 = Player.builder().username("Knucks169").playerId("10101").build();
        Game joinedGame = gameService.joinGame(player2,EXISTING_GAME_ID);

        // ASSERT
        assertNotNull(joinedGame);
        // Check if the game contains both players
        assertEquals(joinedGame.getPlayer1(),playerGame1);
        assertEquals(joinedGame.getPlayer2(),player2);

    }

    @Test
    public void GameService_JoinGame_ThrowsGameNotFoundException(){
        // ARRANGE
        String NON_EXISTING_GAME_ID = "123456-abcde";
        when(gameStorage.getGames().containsKey(NON_EXISTING_GAME_ID)).thenReturn(false);
        Player player2 = Player.builder().username("Lubs020").playerId("123").build();
        // No need to mock the rest of the function since it is gonna throw the exception on the second line

        // ACT
        Exception exception = assertThrows(GameNotFoundException.class, ()-> gameService.joinGame(player2,NON_EXISTING_GAME_ID));
        // ASSERT
        assertEquals("Sorry, unfortunately this game does not exist", exception.getMessage());
        // Verify that addGame was NOT called (should fail early)
        verify(gameStorage, never()).addGame(any(Game.class));


    }

    @Test
    public void GameService_JoinGame_ThrowsInvalidGameException(){
        // ARRANGE
        // Mock an invalid game
        Player player1 = Player.builder().username("Knuck-x-Dave").playerId("SW-16").build();
        String invalidGameID = UUID.randomUUID().toString();
        Game invalidGame = new Game(player1,invalidGameID);
        invalidGame.setStatus(GameStatus.ABANDONED);

        // When for gameStorage contains key- To skip the exception
        when(gameStorage.getGames().containsKey(invalidGameID)).thenReturn(true);
        // When for gameStorage to get the invalid game
        when(gameStorage.getGames().get(invalidGameID)).thenReturn(invalidGame);

        // ACT ON THE EXCEPTION
        Player player2 = Player.builder().username("Cench").playerId("Bush-249").build();
        Exception exception = assertThrows(InvalidGameException.class, ()-> gameService.joinGame(player2,invalidGameID));

        assertEquals("Sorry, you can't join this game. It is full", exception.getMessage());
        // Verify that addGame was NOT called (should fail early)
        verify(gameStorage, never()).addGame(any(Game.class));
    }
}
