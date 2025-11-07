package com.lubasi.tekk_match.game.exceptions;

public class EmptyMatchmakingQueue extends Exception{
    private String message;

    public EmptyMatchmakingQueue(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }
}
