package com.lubasi.tekk_match.demo;


import com.lubasi.tekk_match.team.models.FootballTeam;
import com.lubasi.tekk_match.team.services.FootballTeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DemoController {
    private final FootballTeamService footballTeamService;
    @Autowired
    public DemoController(FootballTeamService footballTeamService){
        this.footballTeamService = footballTeamService;
    }

    @GetMapping("/")
    public List<FootballTeam> demo(){
        return footballTeamService.getAllTeams();
    }
}
