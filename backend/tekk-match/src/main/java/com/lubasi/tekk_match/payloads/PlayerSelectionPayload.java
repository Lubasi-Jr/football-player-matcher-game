package com.lubasi.tekk_match.payloads;

import com.lubasi.tekk_match.footballer.models.Footballer;
import com.lubasi.tekk_match.game.models.Player;
import lombok.Data;

@Data
public class PlayerSelectionPayload {
    private String gameId;
    private Footballer footballer;
    private Player player;
}
