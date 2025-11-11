package com.lubasi.tekk_match.payloads;

import lombok.Data;

/**
 * Payload for leaving a game.
 */
@Data
public class LeaveGamePayload {
    private String gameId;
}
