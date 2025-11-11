package com.lubasi.tekk_match.payloads;

import com.lubasi.tekk_match.game.models.Player;
import lombok.Data;

@Data
public class TeamSelectionPayload {
    private String gameId;
    private Long teamId;
    private Player player;
}
