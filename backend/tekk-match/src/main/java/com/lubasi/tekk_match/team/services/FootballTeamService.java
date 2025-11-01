package com.lubasi.tekk_match.team.services;

import com.lubasi.tekk_match.team.models.FootballTeam;
import com.lubasi.tekk_match.team.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FootballTeamService {
    private final TeamRepository teamRepository;

    @Autowired
    public FootballTeamService(TeamRepository teamRepository){
        this.teamRepository = teamRepository;
    }

    public List<FootballTeam> getAllTeams(){
        return teamRepository.findAll();
    }

    public List<FootballTeam> getTeamsByLeague(String leagueName){
        return teamRepository.findByLeague(leagueName);
    }

    public boolean hasFootballerPlayedForTeam(UUID playerId, Long teamId){
        return teamRepository.footballerHasPlayedForTeam(playerId,teamId);
    }
}
