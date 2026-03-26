import os
from celery import Celery

def make_celery():
    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    celery = Celery(
        'ai_review_tasks',
        broker=redis_url,
        backend=redis_url
    )
    celery.conf.update(
        task_serializer='json',
        accept_content=['json'],
        result_serializer='json',
        timezone='UTC',
        enable_utc=True,
    )
    return celery

celery_app = make_celery()

@celery_app.task(name="generate_code_review_task")
def generate_code_review_task(code, language, user_email=None):
    # Critical: Lazy import inner scopes inside the worker node to avoid global circular dependencies
    from api.services.review_service import process_review_request
    response, status_code = process_review_request(code, language, user_email)
    return {"response": response, "status_code": status_code}
