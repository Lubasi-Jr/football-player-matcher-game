-- Creates the new player and played_for tables that db_migration_new.py
-- writes into. Mirrors the original schema in database_build.sql, plus a
-- unique constraint on (player_id, team_id) so duplicate (player, team)
-- pairs are rejected at the DB layer too -- belt-and-braces on top of
-- the in-memory dedup the migration script already does.
--
-- After db_migration_new.py finishes you can swap the tables in:
--
--   DROP TABLE played_for;
--   DROP TABLE player;
--   ALTER TABLE player_new      RENAME TO player;
--   ALTER TABLE played_for_new  RENAME TO played_for;

CREATE TABLE player_new (
    id          UUID         PRIMARY KEY NOT NULL,
    full_name   VARCHAR(250) NOT NULL,
    position    VARCHAR(250),
    nationality VARCHAR(250),
    flag_url    VARCHAR(250),
    dob         VARCHAR(250)
);

CREATE TABLE played_for_new (
    id        SERIAL PRIMARY KEY NOT NULL,
    player_id UUID   REFERENCES player_new(id)   ON DELETE CASCADE,
    team_id   INT    REFERENCES football_team(id) ON DELETE CASCADE,
    CONSTRAINT played_for_new_player_team_unique UNIQUE (player_id, team_id)
);

-- Speeds up the "which players played for team X?" query the game needs.
CREATE INDEX played_for_new_team_id_idx   ON played_for_new (team_id);
CREATE INDEX played_for_new_player_id_idx ON played_for_new (player_id);
