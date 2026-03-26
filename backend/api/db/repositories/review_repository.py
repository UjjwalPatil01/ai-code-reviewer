from ..client import get_db
import datetime
import json

def save_review(code, language, response, user_email=None):
    db = get_db()
    try:
        db.execute(
            "INSERT INTO reviews (code, language, response, user_email, created_at) VALUES (?, ?, ?, ?, ?)",
            (code, language, json.dumps(response), user_email, datetime.datetime.utcnow().isoformat())
        )
        db.commit()
    except Exception as e:
        import logging
        logging.error(f"Failed to save review: {e}")
    return "local-sql-id"

def get_reviews_by_user(user_email):
    db = get_db()
    cur = db.execute("SELECT * FROM reviews WHERE user_email = ? ORDER BY created_at DESC", (user_email,))
    rows = cur.fetchall()
    res = []
    for r in rows:
        d = dict(r)
        d['response'] = json.loads(d['response'])
        res.append(d)
    return res
