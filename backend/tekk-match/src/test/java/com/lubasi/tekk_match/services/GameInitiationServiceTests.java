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
import org.junit.jupiter.api.BeforeEach;
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
    private Queue<Player> matchmaking;

    @InjectMocks
    private GameService gameService;

    private Map<String, Game> mockGameMap;
    private Player commonPlayer;

    @BeforeEach
    void setUp() {
        // Initialize a clean map and a common player before every test
        mockGameMap = new HashMap<>();
        commonPlayer = Player.builder().username("Lubs020").playerId("123").build();

        // Provide a default return for getGames to avoid NullPointerExceptions
        // and fix the "WrongTypeOfReturnValue" by returning a real Map
        lenient().when(gameStorage.getGames()).thenReturn(mockGameMap);
    }

    @Test
    public void GameService_CreateNewGame_ReturnsNewGame() {
        Game newGame = gameService.createNewGame(commonPlayer);

        assertNotNull(newGame);
        assertNotNull(newGame.getGameId());
        assertEquals(newGame.getPlayer1(), commonPlayer);

        verify(gameStorage, times(1)).addGame(newGame);
    }

    @Test
    public void GameService_JoinGame_ReturnsUpdatedGameWithPlayers() throws Exception {
        // ARRANGE
        String EXISTING_GAME_ID = "12345-abcde";
        Game game1 = new Game(commonPlayer, EXISTING_GAME_ID);
        mockGameMap.put(EXISTING_GAME_ID, game1);

        // ACT
        Player player2 = Player.builder().username("Knucks169").playerId("10101").build();
        Game joinedGame = gameService.joinGame(player2, EXISTING_GAME_ID);

        // ASSERT
        assertNotNull(joinedGame);
        assertEquals(joinedGame.getPlayer1(), commonPlayer);
        assertEquals(joinedGame.getPlayer2(), player2);
    }

    @Test
    public void GameService_JoinGame_ThrowsGameNotFoundException() {
        // ARRANGE
        String NON_EXISTING_GAME_ID = "123456-abcde";
        // mockGameMap is already empty from setUp()

        // ACT & ASSERT
        Exception exception = assertThrows(GameNotFoundException.class, () ->
                gameService.joinGame(commonPlayer, NON_EXISTING_GAME_ID));

        assertEquals("Sorry, unfortunately this game does not exist", exception.getMessage());
        verify(gameStorage, never()).addGame(any(Game.class));
    }

    @Test
    public void GameService_JoinGame_ThrowsInvalidGameException() {
        // ARRANGE
        String invalidGameID = UUID.randomUUID().toString();
        Game invalidGame = new Game(commonPlayer, invalidGameID);
        invalidGame.setStatus(GameStatus.ABANDONED);

        mockGameMap.put(invalidGameID, invalidGame);

        // ACT & ASSERT
        Player player2 = Player.builder().username("Cench").playerId("Bush-249").build();
        Exception exception = assertThrows(InvalidGameException.class, () ->
                gameService.joinGame(player2, invalidGameID));

        assertEquals("Sorry, you can't join this game. It is full", exception.getMessage());
        verify(gameStorage, never()).addGame(any(Game.class));
    }
}