from src.markdown_extractor import clean_markdown_line
import os
from dotenv import load_dotenv
import psycopg2
from pathlib import Path
load_dotenv()

def main():
    print("Hello from database-setup!")
    connection = psycopg2.connect(dbname="tekk_match",user="postgres",password= os.getenv("PG_PASSWORD"),host="localhost")
    cursor = connection.cursor()
    # Before beginning the extraction process. Obtain all ID and add them to a set. Reduces the number of DB queries
    
    base_dir = Path(__file__).parent

    # Construct the path to the markdown file
    filepath = base_dir / "football-teams" / "liverpool_markdown.md"
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

                # ID exists- only update the many-to-many table
                # ID does not exist- create new player and create new row in the player_club_table
                player_query = f"INSERT INTO player (id,full_name,position,nationality,flag_url,dob) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id;"
                player_data_to_insert = (str(player.createUUID()),player.fullname,player.position,player.nationality,player.flag_url,player.dob)
                cursor.execute(player_query,player_data_to_insert)
                new_player_id = cursor.fetchone()[0]
                print(f"User inserted successfully with ID: {new_player_id}")
                connection.commit()

                played_for_query = f"INSERT INTO played_for (player_id,team_id) VALUES (%s,%s);"
                played_for_data_to_insert = (new_player_id,1)
                cursor.execute(played_for_query,played_for_data_to_insert)
                connection.commit()

                #print("Queries complete, moving on to next player")

            
                # End it with resetting the buffer
                buffer = ""
            # Line does not yet contain all the info for the player details
    
    connection.close()
    cursor.close()


if __name__ == "__main__":
    main()
