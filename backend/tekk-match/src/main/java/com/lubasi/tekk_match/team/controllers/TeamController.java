package com.lubasi.tekk_match.team.controllers;

import com.lubasi.tekk_match.team.models.FootballTeam;
import com.lubasi.tekk_match.team.services.TeamService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/")
public class TeamController {
    private TeamService teamService;


    @GetMapping
    // ResponseEntity allows you to explicitly set the HTTP status code (e.g., 200 OK)
    public ResponseEntity<List<FootballTeam>> getAllTeams() {
        List<FootballTeam> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);

        // Alternative for empty list:
        // if (teams.isEmpty()) {
        //     return ResponseEntity.noContent().build(); // HTTP 204 No Content
        // } else {
        //     return ResponseEntity.ok(teams); // HTTP 200 OK
        // }
    }
}
