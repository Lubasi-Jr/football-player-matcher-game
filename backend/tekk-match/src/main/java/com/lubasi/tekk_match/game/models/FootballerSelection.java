package com.lubasi.tekk_match.game.models;

import com.lubasi.tekk_match.footballer.models.Footballer;
import lombok.Data;

import java.time.Instant;
import java.util.Date;

@Data
public class FootballerSelection {
    private Player selectedBy;
    private Footballer validFootballer;
    private Instant selectedAt;

    public FootballerSelection(Player player, Footballer validBaller){
        this.selectedAt = Instant.now();
        this.selectedBy = player;
        this.validFootballer = validBaller;
    }
}
