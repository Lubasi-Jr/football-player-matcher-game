package com.lubasi.tekk_match.team.models;

import com.lubasi.tekk_match.footballer.Footballer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    @ManyToMany( cascade = CascadeType.REMOVE)
    @JoinTable(
            name = "played_for",
            joinColumns = @JoinColumn(name = "team_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id")
    )
    private List<Footballer> footballers;
}
