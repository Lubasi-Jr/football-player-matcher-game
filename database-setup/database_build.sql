-- Creates the player table
CREATE TABLE player (
    id UUID PRIMARY KEY NOT NULL,
    full_name VARCHAR(250) NOT NULL,
    position VARCHAR(250),
    nationality VARCHAR(250),
    flag_url VARCHAR(250), 
    dob VARCHAR(250)
);

-- Creates the football_team table
CREATE TABLE football_team (
    id SERIAL PRIMARY KEY NOT NULL,
    team_name VARCHAR(250) NOT NULL,
    league VARCHAR(250) NOT NULL
);

-- Creates the junction table to link players and teams ⚽️
CREATE TABLE played_for (
    id SERIAL PRIMARY KEY NOT NULL,
    player_id UUID REFERENCES player(id) ON DELETE CASCADE,
    team_id INT REFERENCES football_team(id) ON DELETE CASCADE
);