package com.lubasi.tekk_match.game.exceptions;

public class InvalidGameException extends Exception{
    private String message;

    public InvalidGameException(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }
}
