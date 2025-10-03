from src.markdown_extractor import clean_markdown_line
import os
from dotenv import load_dotenv
import psycopg2
from pathlib import Path
load_dotenv()

def getfilepath(team_name):
    base_dir = Path(__file__).parent

    # Construct the path to the markdown file
    filepath = base_dir / "football-teams" / f"{team_name}.md"
    return filepath

def queryExecutor(query,data,cur,conn):
    cur.execute(query,data)
    query_result = cur.fetchone()[0]
    conn.commit()
    return query_result

def getAllID(cur):
    query = f"SELECT id FROM player;"
    cur.execute(query)
    records = cur.fetchall()
    id_array = list(map(lambda tp: tp[0],records))
    all_IDs = set(id_array)
    return all_IDs



def main():
    print("Hello from database-setup!")
    connection = psycopg2.connect(dbname="tekk_match",user="postgres",password= os.getenv("PG_PASSWORD"),host="localhost")
    cursor = connection.cursor()
    # Before beginning the extraction process. Obtain all ID and add them to a set. Reduces the number of DB queries
    allPlayerIDs = getAllID(cursor)
   

    # Construct the path to the markdown file
    filepath = getfilepath("tottenham_hotspur")
    team_id = 6
    # filepath = "markdown_snippet.md"
    buffer = ""
    with open(filepath,'r',encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            buffer += line
            if (buffer.startswith('|') and buffer.endswith('|')):
                # Valid line
                buffer = buffer.strip()
                player_details_array = buffer.split('|')
                player = clean_markdown_line(player_details_array)

                # Check if ID already exists in the database
                player_id = str(player.createUUID())

                if(player_id not in allPlayerIDs):
                    # Create a new player if this markdown line is not in the list of current players
                    player_query = f"INSERT INTO player (id,full_name,position,nationality,flag_url,dob) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id;"
                    player_data_to_insert = (player_id,player.fullname,player.position,player.nationality,player.flag_url,player.dob)
                    new_player_id = queryExecutor(player_query,player_data_to_insert,cursor,connection)
                # Whether new player or not, always update the played for table
                played_for_query = f"INSERT INTO played_for (player_id,team_id) VALUES (%s,%s) RETURNING player_id;"
                played_for_data_to_insert = (player_id,team_id)
                result = queryExecutor(played_for_query,played_for_data_to_insert,cursor,connection)
                # End it with resetting the buffer
                buffer = ""
            # Line does not yet contain all the info for the player details
    print("Player entries complete")
    connection.close()
    cursor.close()


if __name__ == "__main__":
    main()
