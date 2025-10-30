package com.lubasi.tekk_match.team.repository;

import com.lubasi.tekk_match.team.models.FootballTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<FootballTeam,Long> {

    List<FootballTeam> findByName(String teamName);
    List<FootballTeam> findByLeague(String leagueName);
}
