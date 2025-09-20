#!/usr/bin/env python3

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    try:
        # Connect to PostgreSQL server (not to a specific database)
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="admin11"
        )
        
        # Set autocommit mode for database creation
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        # Create a cursor
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'darknexis'")
        exists = cursor.fetchone()
        
        if not exists:
            # Create the database
            cursor.execute('CREATE DATABASE darknexis')
            print("✅ Database 'darknexis' created successfully!")
        else:
            print("ℹ️ Database 'darknexis' already exists.")
        
        cursor.close()
        conn.close()
        
    except psycopg2.Error as e:
        print(f"❌ Error creating database: {e}")
        return False
    
    return True

if __name__ == "__main__":
    create_database()