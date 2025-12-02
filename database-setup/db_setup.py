from src.markdown_extractor import clean_markdown_line
import os
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client, Client
load_dotenv()



def getfilepath(team_name):
    base_dir = Path(__file__).parent

    # Construct the path to the markdown file
    filepath = base_dir / "football-teams" / f"{team_name}.md"
    return filepath

def playerQueryExecutor(playersArray, supabase):
    # Players array should be of type objects where object = {id,full_name,position,nationality,flag_url,dob}
    try:
        response = (
            supabase.table("player")
            .insert(playersArray)
            .execute()
        )
        return response
    except Exception as exception:
        print(exception)
        return exception
def playedForQueryExecutor(playedForArray, supabase):
    try:
        response = (
            supabase.table("played_for")
            .insert(playedForArray)
            .execute()
        )
        return response
    except Exception as exception:
        print(exception)
        return exception
    
def main():
    # Supabase
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key)
    playerList = []
    playedForList = []
    # Construct the path to the markdown file
    filepath = getfilepath("liverpool_markdown")
    team_id = 1
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

                player_id = str(player.createUUID())
                # Create the player object and append it to the array
                newPlayer = {}
                newPlayer["id"] = player_id
                newPlayer["full_name"] = player.fullname
                newPlayer["position"]= player.position
                newPlayer["nationality"]= player.nationality
                newPlayer["flag_url"]= player.flag_url
                newPlayer["dob"]= player.dob

                # Add the new player to the list
                playerList.append(newPlayer)

                # Create data for the played for table
                newPlayedFor = {}
                newPlayedFor["player_id"] = player_id
                newPlayedFor["team_id"] = team_id
                playedForList.append(newPlayedFor)

                # Clear the buffer to allow a new player
                buffer = ""
    # Once the entire file has been read, perform both bulk queries
    result = playerQueryExecutor(playerList,supabase)
    if isinstance(result,Exception):
        print("An error occured when executing the query to update the Players Table")
    else:
        print("Players Table updated successfully, please refresh your supabase")
    result2 = playedForQueryExecutor(playedForList,supabase)
    if isinstance(result2,Exception):
        print("An error occured when executing the query to update the Played For Table")
    else:
        print("Played For Table updated successfully, please refresh your supabase")

if __name__ == "__main__":
    main()