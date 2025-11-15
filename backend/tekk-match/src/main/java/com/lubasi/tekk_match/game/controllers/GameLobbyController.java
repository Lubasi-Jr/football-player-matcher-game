package com.lubasi.tekk_match.game.controllers;

import com.lubasi.tekk_match.game.Game;
import com.lubasi.tekk_match.game.exceptions.EmptyMatchmakingQueue;
import com.lubasi.tekk_match.game.exceptions.GameNotFoundException;
import com.lubasi.tekk_match.game.exceptions.InvalidGameException;
import com.lubasi.tekk_match.game.models.Player;
import com.lubasi.tekk_match.game.services.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameLobbyController {

    private final GameService gameService;

    @Autowired
    public GameLobbyController(GameService gameService){
        this.gameService = gameService;
    }

    /**
     * Creates a new game.
     * Client sends: POST /api/game/create
     * Body: { "id": "p1", "name": "Player One" }
     */
    @PostMapping("/create")
    public ResponseEntity<Game> createNewGame(@RequestBody Player player){
        Game newGame = gameService.createNewGame(player);
        return ResponseEntity.ok(newGame);
    }

    /**
     * Joins a specific game by its ID.
     * Client sends: POST /api/game/join/{gameId}
     * Body: { "id": "p2", "name": "Player Two" }
     */
    @PostMapping("/join/{gameId}")
    public ResponseEntity<Game> joinGame(@PathVariable String gameId, @RequestBody Player player2){
        try{
            Game gameToJoin = gameService.joinGame(player2,gameId);
            return ResponseEntity.ok(gameToJoin);
        } catch (GameNotFoundException gameNotFoundException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (InvalidGameException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Joins a random game (matchmaking).
     * Client sends: POST /api/game/join-random
     * Body: { "id": "p-random", "name": "Random Player" }
     */
    @PostMapping("/join-random")
    public ResponseEntity<?> joinRandomGame(@RequestBody Player player){
        try {
            Game randomGame = gameService.joinRandomGame(player);
            return ResponseEntity.ok(randomGame);
        } catch (EmptyMatchmakingQueue e) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Waiting for another Player");
        }
    }
}
