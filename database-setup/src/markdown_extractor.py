import re
import requests
from typing import List
from .player import Player
filepath = "markdown_snippet.md"

'''
    Reads the markdown file line and returns the player object
'''

def get_player_name(section):
    name_pattern = r'\[(.+)\]\((.*) \"(.+?)\"\)'

    match = re.match(name_pattern,section)
    if match:
        name = match.group(1)
        return name
    else:
        return "Football Player Name"

def get_country_and_url(section):
    country_pattern = r'\!\[([A-Za-z ]+)\]\((https?://[^ ]+)\)'
    match = re.match(country_pattern,section)
    if match:
        country = match.group(1)
        flag_url = match.group(2)
        return (country,flag_url)
    else:
        return ('Country','www.example.com')

def clean_markdown_line(player_array: List[str]) -> Player:
    player_array = player_array[1:(len(player_array)-1)]
    # print(player_array)
    # Sample array -> [' [Alexis Mac Allister](https://www.worldfootball.net/player_summary/alexis-mac-allister/ "Alexis Mac Allister") ', ' ![Argentina](https://s.hs-data.com/bilder/flaggen_neu/58.gif) ', ' Argentina ', ' Midfielder ', ' 24/12/1998 ']
    # Sample Country url section -> ' ![Argentina](https://s.hs-data.com/bilder/flaggen_neu/58.gif) '
    # Position index -> 3
    # DOB index -> 4... Could be empty though

    # Get player name
    player_name_section = player_array[0].strip()
    player_name = get_player_name(player_name_section)
    # Get nationality and country url
    country_url_section = player_array[1].strip()
    country,flag = get_country_and_url(country_url_section)
    # Get player position
    player_position = player_array[3].strip()
    dob = player_array[-1].strip()
    # Date of birth could potentially be empty, unknown. Therefore check for falsy
    if not dob:
        dob = '01/01/1900'
    # Finally, create player object
    footballer = Player(player_name,player_position,country,flag,dob)
    return footballer

    



