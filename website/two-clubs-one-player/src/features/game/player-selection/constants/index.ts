import { UUID } from "crypto";
import { Player } from "@/context/PlayerProvider";

export type Footballer = {
    footballerId: UUID;
    footballerName: string;
    position: string;
    nationality: string;
    flag: string;
    dob: string;
}

export type PlayerSelectionPayload = {
    gameId: string;
    footballer: Footballer;
    player: Player;
}