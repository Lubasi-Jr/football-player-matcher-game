import uuid
from uuid import UUID

class Player:

    player_id: str
    fullname: str
    position: str
    nationality: str
    flag_url: str
    dob: str

    def __init__(self, fullname: str, position: str, nationality: str, flag_url: str, dob: str):
        self.fullname = fullname
        self.position = position
        self.nationality = nationality
        self.flag_url = flag_url
        self.dob = dob
    def createUUID(self) -> UUID:
        combination = self.fullname+self.position+self.nationality+self.dob
        encoded = uuid.uuid3(uuid.NAMESPACE_DNS,combination)
        return encoded
    
