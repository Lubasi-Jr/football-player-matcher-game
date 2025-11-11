package com.lubasi.tekk_match.payloads;

import lombok.Data;

/**
 * Payload for requesting a replay/next round.
 */
@Data
public class ReplayPayload {
    private String gameId;
    private String playerId;
}
