## Scope

This directory (`backend/tekk-match`) is the Spring Boot service for **Tekk Match**, a real-time multiplayer "2 Clubs 1 Player" football trivia game. The Next.js frontend and the database-setup scripts live in sibling directories at the repo root (`website/`, `database-setup/`) and are versioned alongside this backend but are out of scope for this module.

## Build & Run

```powershell
mvn clean install          # build + run tests
mvn spring-boot:run        # run locally on :8080
mvn clean package -DskipTests   # build the deployable JAR (target/tekk-match-0.0.1-SNAPSHOT.jar)
```

Tests:

```powershell
mvn test                                    # all tests
mvn -Dtest=GameInitiationServiceTests test  # single test class
mvn -Dtest=GameInitiationServiceTests#GameService_CreateNewGame_ReturnsNewGame test   # single test method
```

`pom.xml` wires Mockito as a `-javaagent` for `surefire` — surefire is the path that test commands must go through (don't bypass it).

## Required environment

`src/main/resources/application.properties` connects to a Supabase-hosted Postgres and requires two env vars to be present at startup:

- `SUPABASE_DB_USER`
- `SUPABASE_DB_PASSWORD`

The pooled URL `aws-1-eu-west-1.pooler.supabase.com:5432/postgres` is hardcoded with `sslmode=require`. A commented-out local-Postgres block lower in the file is the template for switching to a local DB.

## Architecture

### Two transports, one game

- `GameLobbyController` (`@RestController`, `/api/game/*`) — **HTTP** for game creation, joining by ID, and matchmaking-queue join.
- `GamePlayController` (`@Controller` with `@MessageMapping`) — **STOMP over WebSocket** for in-game actions (team select, player select, replay, leave, sync).

`WebSocketConfig` registers two STOMP endpoints:
- `/tekk` — SockJS (browser clients)
- `/postman` — raw WebSocket (tools)

Broker prefixes: clients **publish** to `/app/...` and **subscribe** to `/gameroom/{gameId}`. Every state change in `GamePlayController` ends with `broadcastGameUpdate(...)` which pushes the entire updated `Game` object to `/gameroom/{gameId}` — the frontend reconstructs UI from the full snapshot, not from deltas.

### State is in-memory, not in the DB

`GameStorage` and `GameReplay` are `@Component` beans wrapping `HashMap<String, ...>`. **All live game state — players, team picks, winner, replay votes — is process-memory only and is lost on restart.** The Postgres database is read-only from this service's perspective: it only stores the catalogue of `football_team` rows, `player` rows (mapped to `Footballer` entity — note the table/class name mismatch), and the `played_for` join table.

### The "played for both teams" check

`TeamRepository.footballerHasPlayedForTeam(playerId, teamId)` is a **native SQL query** against the `played_for` join table. The JPA `@ManyToMany` mapping between `FootballTeam` and `Footballer` is deliberately commented out in both entities — the team explicitly chose the native-query path to avoid loading large player rosters when validating a single guess. Don't reintroduce the JPA mapping without checking why it was removed.

### Game state machine (`GameStatus` enum)

`NEW → IN_PROGRESS → FINISHED → IN_PROGRESS (on replay) → ... → ABANDONED`

- `NEW`: created by player 1, awaiting player 2.
- `IN_PROGRESS`: both players present, picking teams or racing for a footballer.
- `FINISHED`: a valid footballer was submitted; winner set; awaiting replay votes.
- `ABANDONED`: a player invoked `/app/game/leave`. The game is removed from `GameStorage` and `GameReplay` immediately after the final broadcast.

Replay requires both players to send to `/app/game/replay` — the `Replay.replayRequests` `Set<String>` deduplicates by player ID, so the second distinct request is what flips the game back to `IN_PROGRESS`.

### Race-condition handling on player guess

`GameService.addPlayerSelection` short-circuits if the game is already `FINISHED` or already has a footballer selection — that's how the "first valid guess wins" race is resolved server-side. Invalid guesses (player didn't play for both teams) update the broadcasting message but leave game state otherwise unchanged so the player can retry. Don't add client-side authority for win detection; the server is the single source of truth.

### CORS

`WebConfig` opens CORS to `*` for all paths/methods/headers. `WebSocketConfig` does the same via `setAllowedOriginPatterns("*")`. This is intentional for the current dev/deploy setup — tighten only if explicitly asked.

## Conventions worth knowing

- The `Footballer` JPA entity maps to a table named **`player`** (`@Table(name = "player")`). Don't be misled by the class name when writing queries.
- `Player` (the in-game user, in `game.models`) is unrelated to `Footballer` (the football pro entity). Both exist; keep them straight.
- Lombok is used heavily (`@Data`, `@Getter`, `@Builder`). The `maven-compiler-plugin` already wires the annotation processor; nothing extra is needed in IDEs once Lombok plugin is installed.
- `application.properties` has `spring.jpa.hibernate.ddl-auto=update` — schema changes from entity edits will auto-apply against the configured DB on startup. Be deliberate about entity changes against the shared Supabase instance.

## Docker

`Dockerfile` is a two-stage build (maven:3.8.4-openjdk-17 → eclipse-temurin:17-jre-alpine), exposes 8080, runs the fat JAR. It does **not** inject the Supabase env vars — those must be supplied at `docker run` / orchestrator level.
