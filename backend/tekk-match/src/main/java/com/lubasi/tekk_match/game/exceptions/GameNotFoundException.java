package com.lubasi.tekk_match.game.exceptions;

public class GameNotFoundException extends Exception{
    private String message;

    public GameNotFoundException(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }
}
