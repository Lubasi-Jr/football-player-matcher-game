package com.lubasi.tekk_match.payloads;

import com.lubasi.tekk_match.game.models.Player;
import lombok.Data;

/**
 * Payload for requesting a replay/next round.
 */
@Data
public class ReplayPayload {
    private String gameId;
    private Player player;
}
