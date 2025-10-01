from src.markdown_extractor import clean_markdown_line

def main():
    print("Hello from database-setup!")
    # Before beginning the extraction process. Obtain all ID and add them to a set. Reduces the number of DB queries
    
    filepath = "markdown_snippet.md"
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


                # End it with resetting the buffer
                buffer = ""
            # Line does not yet contain all the info for the player details


if __name__ == "__main__":
    main()
