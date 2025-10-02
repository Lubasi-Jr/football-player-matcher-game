from .db_connection import get_db_connection_and_cursor

conn, cursor = get_db_connection_and_cursor()

if(conn is not None):
    
    try:
        sql_query = f"SELECT * FROM football_team"
        print("Attempting to execute query")
        cursor.execute(sql_query)
        records = cursor.fetchall()


    except Exception as e:
        print(f"An error occurred during query execution: {e}")
        if cursor:
            cursor.close()
        if conn:
            cursor.close()
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            cursor.close()
else:
    print("Connection failed, error message already printed by get_db_connection_and_cursor")