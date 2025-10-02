import psycopg2
from dotenv import load_dotenv
import os
load_dotenv()

connection = psycopg2.connect(dbname="tekk_match",user="postgres",password= os.getenv("PG_PASSWORD"),host="localhost")
cursor = connection.cursor()

team_name = 'Liverpool'
table_name = 'football_team'
sql_query = f"SELECT * FROM {table_name}"

cursor.execute(sql_query)
records = cursor.fetchall()

print(f"ID's in the {table_name} table are as follows: -")
result = list(map(lambda team_data: team_data[0], records))
for id in result:
    print(id)


connection.close()
cursor.close()