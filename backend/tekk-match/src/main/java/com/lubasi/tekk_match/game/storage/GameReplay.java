package com.lubasi.tekk_match.game.storage;

import com.lubasi.tekk_match.game.models.Replay;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Getter
public class GameReplay {
    private final Map<String, Replay> gameReplays = new HashMap<>();

    public void addNewReplay(String gameID){
        // Create new Replay object
        Replay newReplay = new Replay();
        gameReplays.put(gameID,newReplay);
    }

    public Replay addNewRequest(String playerID, String gameID){
        Replay replay = gameReplays.get(gameID);
        replay.addReplayRequest(playerID);
        gameReplays.put(gameID,replay);
        return replay;
    }
}
