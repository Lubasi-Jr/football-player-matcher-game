package com.lubasi.tekk_match.team.repository;

import com.lubasi.tekk_match.team.models.FootballTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<FootballTeam,Long> {

    List<FootballTeam> findByTeamName(String teamName);
    List<FootballTeam> findByLeague(String leagueName);

    @Query(
            value = """
                    SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END
                            FROM played_for pf
                            WHERE pf.player_id = :playerId
                              AND pf.team_id = :teamId
                    """,
            nativeQuery = true
    )
    boolean footballerHasPlayedForTeam(@Param("playerId") UUID playerId, @Param("teamId") Long teamId);
}
