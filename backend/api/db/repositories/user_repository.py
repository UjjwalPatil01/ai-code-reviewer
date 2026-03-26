from ..client import get_db
import datetime

def create_user(email, password_hash=None, full_name=None, is_verified=False, auth_provider="local"):
    db = get_db()
    db.execute(
        "INSERT INTO users (email, password, full_name, is_verified, auth_provider, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (email, password_hash, full_name, is_verified, auth_provider, datetime.datetime.utcnow().isoformat())
    )
    db.commit()
    return email

def get_user_by_email(email):
    db = get_db()
    cur = db.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cur.fetchone()
    return dict(row) if row else None

