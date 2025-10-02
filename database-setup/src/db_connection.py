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

print(f'Row in the {table_name} table are as follows: -')
for row in records:
    print(row)


connection.close()
cursor.close()