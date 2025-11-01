package com.lubasi.tekk_match.team.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="football_team")
public class FootballTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ✅ Use IDENTITY for SERIAL
    @Column(name = "id")
    private Long footballTeamId;
    @Column(name = "team_name")
    private String teamName;
    private String league;

    // For the specific use case of the game, you do not need to fetch the team as well as all players that play for that team

//    @ManyToMany( cascade = CascadeType.REMOVE,fetch = FetchType.LAZY)
//    @JoinTable(
//            name = "played_for",
//            joinColumns = @JoinColumn(name = "team_id"),
//            inverseJoinColumns = @JoinColumn(name = "player_id")
//    )
//    private List<Footballer> footballers;
}
