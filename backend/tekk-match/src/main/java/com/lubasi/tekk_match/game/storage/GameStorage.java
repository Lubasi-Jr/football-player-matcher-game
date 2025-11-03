package com.lubasi.tekk_match.game.storage;

import com.lubasi.tekk_match.game.Game;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class GameStorage {
    private final Map<String, Game> games;

    public GameStorage(){
        this.games = new HashMap<>();
    }

    public Map<String,Game> getGames(){
        return games;
    }

    public void setGames(Game game){
        games.put(game.getGameId(),game);
    }


}
