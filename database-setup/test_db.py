from db_connection import get_db_connection_and_cursor

records, cursor = get_db_connection_and_cursor()

if(records is not None):
    
    try:
        print("Records below")
        print(records)


    except Exception as e:
        print(f"An error occurred during query execution: {e}")
    finally:
        if cursor:
            cursor.close()
else:
    print("Connection failed, error message already printed by get_db_connection_and_cursor")