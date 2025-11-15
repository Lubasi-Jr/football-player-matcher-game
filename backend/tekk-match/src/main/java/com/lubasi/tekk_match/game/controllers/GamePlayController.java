package com.lubasi.tekk_match.game.controllers;

import com.lubasi.tekk_match.game.Game;
import com.lubasi.tekk_match.game.services.GameService;
import com.lubasi.tekk_match.payloads.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class GamePlayController {
    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public GamePlayController(GameService gameService, SimpMessagingTemplate simpMessagingTemplate){
        this.gameService = gameService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    /**
     * Helper method to broadcast the full game state to its specific topic.
     */
    private void broadcastGameUpdate(Game game) {
        String destination = "/gameroom/" + game.getGameId();
        simpMessagingTemplate.convertAndSend(destination, game);
    }

    /**
     * Handles a player's team selection.
     * Client sends to: /app/game/select-team
     */
    @MessageMapping("/game/select-team")
    public void selectTeam(@Payload TeamSelectionPayload payload){
        Game updatedGame = gameService.addTeamSelection(payload.getTeamId(), payload.getGameId(), payload.getPlayer());
        broadcastGameUpdate(updatedGame);
    }

    /**
     * Handles a player's footballer selection (the winning move).
     * Client sends to: /app/game/select-player
     */
    @MessageMapping("/game/select-player")
    public void selectPlayer(@Payload PlayerSelectionPayload payload){
        Game updatedGame = gameService.addPlayerSelection(payload.getFootballer(), payload.getGameId(), payload.getPlayer());
        broadcastGameUpdate(updatedGame);
    }

    /**
     * Handles a player's request for a replay (next round).
     * Client sends to: /app/game/replay
     */
    @MessageMapping("game/replay")
    public void replayGame(@Payload ReplayPayload payload){
        Game updatedGame = gameService.replayRequest(payload.getGameId(), payload.getPlayer());
        broadcastGameUpdate(updatedGame);
    }

    /**
     * Handles a player leaving the game (abandoning).
     * Client sends to: /app/game/leave
     */
    @MessageMapping("/game/leave")
    public void leaveGame(@Payload LeaveGamePayload payload) {
        Game abandonedGame = gameService.leaveGame(payload.getGameId());

        // Broadcast the final "ABANDONED" state
        broadcastGameUpdate(abandonedGame);
    }
}
