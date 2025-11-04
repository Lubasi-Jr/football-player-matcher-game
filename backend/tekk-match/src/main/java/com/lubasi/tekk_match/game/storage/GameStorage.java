package com.lubasi.tekk_match.game.storage;

import com.lubasi.tekk_match.game.Game;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Getter
public class GameStorage {
    private final Map<String, Game> games = new HashMap<>();;

    public void addGame(Game game){
        games.put(game.getGameId(),game);
    }
}
