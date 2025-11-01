package com.lubasi.tekk_match.footballer;

import com.lubasi.tekk_match.team.models.FootballTeam;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "player", uniqueConstraints = @UniqueConstraint(name = "unique_player_id", columnNames = "id"))
public class Footballer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID footballerId;

    @Column(name = "full_name")
    private String footballerName;

    private String position;
    private String nationality;
    @Column(name = "flag_url")
    private String flag;
    private String dob;

    @ManyToMany(mappedBy = "footballers")
    private List<FootballTeam> teamsPlayedFor;
}
