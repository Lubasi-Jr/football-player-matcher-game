package com.lubasi.tekk_match.footballer.services;

import com.lubasi.tekk_match.footballer.models.Footballer;
import com.lubasi.tekk_match.footballer.repository.FootballerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class FootballerService {
    private final FootballerRepository footballerRepository;

    @Autowired
    public FootballerService(FootballerRepository footballerRepository){
        this.footballerRepository = footballerRepository;
    }

    public List<Footballer> getPlayersFromSearchQuery(String searchQuery, Pageable pageable){
        if(searchQuery == null || searchQuery.trim().isEmpty()){
            // Return all players from the player table by default
            return footballerRepository.findAll(pageable).getContent();
        }
        return footballerRepository.findByFootballerNameContainingIgnoreCase(searchQuery,pageable);
    }

}
