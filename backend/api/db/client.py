import sqlite3
import os
import threading

_local = threading.local()
_local.db = None
_db_path = os.environ.get("SQLITE_DB_PATH", os.path.join(os.path.dirname(__file__), "ai_code_review.db"))

def init_db():
    conn = sqlite3.connect(_db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            full_name TEXT,
            password TEXT,
            is_verified BOOLEAN DEFAULT 0,
            auth_provider TEXT,
            current_otp TEXT,
            otp_expires TEXT,
            created_at TEXT
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT,
            language TEXT,
            response TEXT,
            user_email TEXT,
            created_at TEXT
        )
    ''')
    conn.commit()
    return conn

def get_db():
    if not hasattr(_local, "db") or _local.db is None:
        _local.db = init_db()
    return _local.db
