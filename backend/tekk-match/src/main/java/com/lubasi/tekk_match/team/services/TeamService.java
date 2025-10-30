package com.lubasi.tekk_match.team.services;

import com.lubasi.tekk_match.team.models.FootballTeam;
import com.lubasi.tekk_match.team.repository.TeamRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamService {
    private TeamRepository teamRepository;

    public List<FootballTeam> getAllTeams(){
        return teamRepository.findAll();
    }

    public List<FootballTeam> getTeamByName(String name){
        return teamRepository.findByName(name);
    }
}
