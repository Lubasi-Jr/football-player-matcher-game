from supabase import Client
from typing import Dict

async def get_existing_player_names(supabase: Client) -> Dict[str, str]:
    """
    Fetches composite player identifiers (Full Name, Position, Nationality) 
    and their corresponding UUIDs from the 'player' table.
    
    This function is crucial for preventing the insertion of duplicate players 
    by quickly identifying existing records and retrieving their primary key (ID).
    
    Args:
        supabase: The initialized Supabase client instance.
        
    Returns:
        A dictionary where:
        - KEY: Unique player identifier (e.g., "LIONEL MESSI|FORWARD|ARGENTINIAN") 
               in uppercase, used for fast lookup.
        - VALUE: The player's unique 'id' (UUID) from the database.
    """
    try:
        # 1. Fetch the required ID and identification columns
        response = (
            supabase.table("player")
            .select("id, full_name, position, nationality")
            .execute()
        )
        
        if response.data is None:
            return {}

        # 2. Build the dictionary mapping the composite key to the player ID
        existing_players_map = {}
        for item in response.data:
            full_name = item.get('full_name', '').strip()
            position = item.get('position', '').strip()
            nationality = item.get('nationality', '').strip()
            player_id = item.get('id')
            
            # Create the unique, case-insensitive composite key
            composite_key = f"{full_name}|{position}|{nationality}".upper()
            
            if player_id:
                existing_players_map[composite_key] = player_id
        
        return existing_players_map
        
    except Exception as e:
        print(f"Error fetching existing player identifiers: {e}")
        # Return an empty dict if the query fails
        return {}