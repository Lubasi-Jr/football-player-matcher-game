import os
import psycopg2
from psycopg2 import OperationalError
from dotenv import load_dotenv

load_dotenv()

# --- Configuration ---
# Define the name of the table you want to query.
TABLE_NAME = "football_team"


def get_db_connection_and_cursor():
    """
    Connects to the PostgreSQL database using environment variables.

    Returns:
        tuple[psycopg2.connection or None, psycopg2.cursor or None]: 
            The connection and cursor objects on success, or (None, None) on failure.
    """
    # 1. Retrieve connection parameters from environment variables
    db_params = {
        "host": os.getenv("PG_HOST"),
        "database": os.getenv("PG_DATABASE"),
        "user": os.getenv("PG_USER"),
        "password": os.getenv("PG_PASSWORD")
    }

    # Check if all environment variables are set
    if not all(db_params.values()):
        print("Error: One or more required environment variables (PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD) are not set.")
        print("Please set them before running the script.")
        return None, None

    print(f"Attempting to connect to database '{db_params['database']}' on host '{db_params['host']}'...")

    conn = None
    cursor = None

    try:
        # 2. Establish the connection
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        print("Connection successful.")
        sql_query = f"SELECT * FROM football_team"
        print("Attempting to execute query")
        cursor.execute(sql_query)
        records = cursor.fetchall()
        
        return records, cursor
    except OperationalError as e:
        print(f"\nDatabase Connection Error: {e}")
        print("Please check your credentials, database status, and network connection.")
        # Ensure cleanup if connection attempt failed but resources were partially allocated
        if conn:
            conn.close()
        return None, None
    except Exception as e:
        print(f"\nAn unexpected error occurred during connection: {e}")
        if conn:
            conn.close()
        return None, None
    finally:
        if conn:
            conn.close()
            print("Database connection closed.")