"""
Re-runs the markdown -> Supabase migration into the `player_new` and
`played_for_new` tables.

Why this rewrite exists
-----------------------
The original migration keyed duplicate detection on `full_name + position +
nationality`, which is brittle (same player recorded with "Forward" vs
"Striker", trailing whitespace, accents, etc. all leak as duplicates) and only
loaded the existing-players map *once* at the start, so two appearances of the
same player inside a single run wouldn't dedupe against each other.

The new strategy keys on the worldfootball.net URL slug found in the markdown
link, e.g. `.../player_summary/christian-eriksen/`. Worldfootball already
disambiguates same-named players itself (`joe-allen_2`, `john-allan_2`), so
the slug is a reliable canonical identifier. We then derive a deterministic
UUID5 from each slug, which means:

  - The same player always gets the same UUID, every run, every team.
  - The script is fully idempotent: re-running it will NOT create duplicates.
  - In-memory dedup of (player_id, team_id) pairs guarantees the played_for
    table is clean too.

Usage
-----
Just run it. No manual edits between teams:

    python db_migration_new.py

Pre-reqs
--------
The `player_new` and `played_for_new` tables should mirror the original schema
(see database_build.sql). For maximum safety, add a unique constraint on
played_for_new (player_id, team_id) so duplicate (player, team) pairs are
rejected at the DB layer too.
"""

import os
import re
import uuid
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Map markdown filename (without .md) -> team_id in the football_team table.
TEAM_FILE_TO_ID = {
    "liverpool_markdown": 1,
    "arsenal": 2,
    "chelsea": 3,
    "machester_united": 4,
    "manchester_city": 5,
    "tottenham_hotspur": 6,
}

PLAYER_TABLE = "player_new"
PLAYED_FOR_TABLE = "played_for_new"

BASE_DIR = Path(__file__).parent
MARKDOWN_DIR = BASE_DIR / "football-teams"

# Fixed namespace UUID used to derive deterministic player UUIDs from slugs.
# Any random-but-fixed UUID works; the only thing that matters is that this
# value never changes across runs.
PLAYER_NAMESPACE = uuid.UUID("3b8a2f3d-7d52-4e6c-9f9e-44d4f02cde91")

BATCH_SIZE = 500
PAGE_SIZE = 1000


# ---------------------------------------------------------------------------
# Markdown parsing
# ---------------------------------------------------------------------------

# Captures the player name and the worldfootball slug from rows like:
#   [Christian Eriksen](https://www.worldfootball.net/player_summary/christian-eriksen/ "Christian Eriksen")
NAME_AND_SLUG_PATTERN = re.compile(
    r'\[(?P<name>[^\]]+)\]'
    r'\(https?://www\.worldfootball\.net/player_summary/(?P<slug>[^/\s"]+)/?\s*'
    r'"[^"]*"\)'
)
COUNTRY_PATTERN = re.compile(r"!\[([^\]]+)\]\((https?://[^)\s]+)\)")


def parse_player_row(row: str) -> Optional[dict]:
    """Parse a single markdown table row into a dict.

    Returns None if the row doesn't look like a valid player row (e.g. header
    separators, malformed lines).
    """
    cells = [c.strip() for c in row.strip().strip("|").split("|")]
    if len(cells) < 5:
        return None

    name_cell = cells[0]
    country_cell = cells[1]
    nationality_cell = cells[2]
    position_cell = cells[3]
    dob_cell = cells[-1]

    m = NAME_AND_SLUG_PATTERN.match(name_cell)
    if not m:
        return None

    full_name = m.group("name").strip()
    slug = m.group("slug").strip().lower()

    cm = COUNTRY_PATTERN.match(country_cell)
    if cm:
        flag_url = cm.group(2).strip()
    else:
        flag_url = ""

    nationality = nationality_cell.strip()
    position = position_cell.strip()
    dob = dob_cell.strip() or "01/01/1900"

    return {
        "slug": slug,
        "full_name": full_name,
        "position": position,
        "nationality": nationality,
        "flag_url": flag_url,
        "dob": dob,
    }


def iter_player_rows(filepath: Path):
    """Yield logical markdown rows, joining lines that wrap mid-row."""
    buffer = ""
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            buffer += line
            if buffer.startswith("|") and buffer.endswith("|"):
                yield buffer
                buffer = ""


# ---------------------------------------------------------------------------
# UUID generation
# ---------------------------------------------------------------------------

def slug_to_uuid(slug: str) -> str:
    """Same slug -> same UUID, always. The whole dedup strategy hinges on this."""
    return str(uuid.uuid5(PLAYER_NAMESPACE, slug))


# ---------------------------------------------------------------------------
# Supabase helpers
# ---------------------------------------------------------------------------

def fetch_existing_player_ids(supabase: Client) -> set:
    existing = set()
    start = 0
    while True:
        resp = (
            supabase.table(PLAYER_TABLE)
            .select("id")
            .range(start, start + PAGE_SIZE - 1)
            .execute()
        )
        rows = resp.data or []
        existing.update(r["id"] for r in rows if r.get("id"))
        if len(rows) < PAGE_SIZE:
            break
        start += PAGE_SIZE
    return existing


def fetch_existing_played_for(supabase: Client) -> set:
    existing = set()
    start = 0
    while True:
        resp = (
            supabase.table(PLAYED_FOR_TABLE)
            .select("player_id, team_id")
            .range(start, start + PAGE_SIZE - 1)
            .execute()
        )
        rows = resp.data or []
        existing.update((r["player_id"], r["team_id"]) for r in rows)
        if len(rows) < PAGE_SIZE:
            break
        start += PAGE_SIZE
    return existing


def chunked(seq, size):
    for i in range(0, len(seq), size):
        yield seq[i:i + size]


def bulk_insert(table: str, rows: list, supabase: Client):
    if not rows:
        print(f"  (nothing to insert into {table})")
        return
    inserted = 0
    for batch in chunked(rows, BATCH_SIZE):
        try:
            supabase.table(table).insert(batch).execute()
            inserted += len(batch)
        except Exception as e:
            print(f"  insert into {table} failed at batch starting {inserted}: {e}")
            raise
    print(f"  inserted {inserted} row(s) into {table}")


# ---------------------------------------------------------------------------
# Orchestrator
# ---------------------------------------------------------------------------

def main():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise SystemExit("SUPABASE_URL / SUPABASE_KEY must be set in the environment")

    supabase: Client = create_client(url, key)

    print(f"Fetching existing rows from {PLAYER_TABLE} and {PLAYED_FOR_TABLE}...")
    existing_player_ids = fetch_existing_player_ids(supabase)
    existing_played_for = fetch_existing_played_for(supabase)
    print(
        f"  found {len(existing_player_ids)} existing players, "
        f"{len(existing_played_for)} existing played_for rows"
    )

    players_by_id: dict = {}
    played_for_pairs: set = set()
    skipped_rows = 0

    for team_file, team_id in TEAM_FILE_TO_ID.items():
        path = MARKDOWN_DIR / f"{team_file}.md"
        if not path.exists():
            print(f"WARN: {path} does not exist, skipping")
            continue

        print(f"\nProcessing {team_file} (team_id={team_id})...")
        parsed_count = 0
        for raw_row in iter_player_rows(path):
            parsed = parse_player_row(raw_row)
            if not parsed:
                skipped_rows += 1
                continue
            parsed_count += 1

            player_id = slug_to_uuid(parsed["slug"])

            if player_id not in players_by_id:
                players_by_id[player_id] = {
                    "id": player_id,
                    "full_name": parsed["full_name"],
                    "position": parsed["position"],
                    "nationality": parsed["nationality"],
                    "flag_url": parsed["flag_url"],
                    "dob": parsed["dob"],
                }

            played_for_pairs.add((player_id, team_id))

        print(f"  parsed {parsed_count} valid player rows")

    if skipped_rows:
        print(f"\n(skipped {skipped_rows} unparseable row(s) across all files)")

    players_to_insert = [
        row for pid, row in players_by_id.items() if pid not in existing_player_ids
    ]
    played_for_to_insert = [
        {"player_id": pid, "team_id": tid}
        for (pid, tid) in played_for_pairs
        if (pid, tid) not in existing_played_for
    ]

    print("\nSummary:")
    print(f"  unique players found across all files: {len(players_by_id)}")
    print(f"  unique (player, team) pairs found:     {len(played_for_pairs)}")
    print(f"  players to insert:                     {len(players_to_insert)}")
    print(f"  played_for rows to insert:             {len(played_for_to_insert)}")
    print(
        f"  skipping {len(players_by_id) - len(players_to_insert)} player(s) "
        f"and {len(played_for_pairs) - len(played_for_to_insert)} played_for row(s) "
        f"already in DB"
    )

    print("\nInserting into player_new...")
    bulk_insert(PLAYER_TABLE, players_to_insert, supabase)

    print("Inserting into played_for_new...")
    bulk_insert(PLAYED_FOR_TABLE, played_for_to_insert, supabase)

    print("\nDone.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Process Ended by A Keyboard interruption")
