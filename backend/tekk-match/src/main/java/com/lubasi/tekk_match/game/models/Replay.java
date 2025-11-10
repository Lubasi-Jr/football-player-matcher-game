package com.lubasi.tekk_match.game.models;

import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Getter
public class Replay {
    Set<String> replayRequests = new HashSet<>();

    public void addReplayRequest(String playerID){
        replayRequests.add(playerID); // If it is identical then it will be ignored since it is a set
    }
}
