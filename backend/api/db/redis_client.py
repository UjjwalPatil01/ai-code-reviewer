import redis
import os
import logging

def get_redis_client():
    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    try:
        r = redis.from_url(redis_url, decode_responses=True)
        r.ping()
        logging.info("Redis connection established successfully.")
        return r
    except redis.ConnectionError:
        logging.warning("Redis is not available locally. Falling back to non-cached AI Generation.")
        return None
