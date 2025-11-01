package com.lubasi.tekk_match.team.controllers;

import com.lubasi.tekk_match.team.models.FootballTeam;
import com.lubasi.tekk_match.team.services.FootballTeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams")
public class FootballTeamController {
    private final FootballTeamService footballTeamService;

    @Autowired
    public FootballTeamController(FootballTeamService footballTeamService){
        this.footballTeamService = footballTeamService;
    }

    @GetMapping
    public List<FootballTeam> getAllTeams(){
        return footballTeamService.getAllTeams();
    }

    @GetMapping("{playerID}/played-for/{teamId}")
    public boolean hasFootballerPlayedFor(@PathVariable UUID playerID, @PathVariable Long teamId){
        return footballTeamService.hasFootballerPlayedForTeam(playerID,teamId);
    }
}
