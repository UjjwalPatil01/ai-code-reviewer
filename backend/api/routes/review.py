from flask import Blueprint, request, jsonify
import hashlib
import json
import logging
from ..validators import validate_review_request
from ..services.review_service import process_review_request
from ..db.repositories.review_repository import get_reviews_by_user
from ..db.redis_client import get_redis_client
from ..tasks.celery_app import generate_code_review_task, celery_app
from ..middleware.auth import token_required

review_bp = Blueprint('review', __name__)
redis_client = get_redis_client()

@review_bp.route('/review', methods=['POST'])
@token_required
def review(current_user_email):
    data = request.get_json()
    
    # 1. Validation Layer
    is_valid, msg, status_code = validate_review_request(data)
    if not is_valid:
        return jsonify({"error": msg}), status_code

    # 2. Redis Caching Interceptor Layer
    cache_key = None
    if redis_client:
        try:
            payload_str = json.dumps({"c": data.get('code',''), "l": data.get('language','')}, sort_keys=True)
            cache_key = f"review_cache:{hashlib.sha256(payload_str.encode('utf-8')).hexdigest()}"
            
            cached_result = redis_client.get(cache_key)
            if cached_result:
                logging.info(f"Redis cache HIT for {cache_key}. Bypassing Gemini API and saving latency.")
                return jsonify(json.loads(cached_result)), 200
        except Exception as e:
            logging.error(f"Redis interceptor failed: {e}")

    # 3. Asynchronous Pipeline Dispatcher
    if redis_client:
        # Standard 0.1% Environment: Dispatch immediately to background worker
        task = generate_code_review_task.delay(data.get('code'), data.get('language'), current_user_email)
        return jsonify({"message": "Task queued successfully for massive multi-threaded scale.", "task_id": task.id}), 202
    else:
        # Synchronous Local Fallback Environment
        response, status_code = process_review_request(data.get('code'), data.get('language'), current_user_email)
        return jsonify(response), status_code


@review_bp.route('/review/status/<task_id>', methods=['GET'])
@token_required
def review_status(current_user_email, task_id):
    task = celery_app.AsyncResult(task_id)
    
    if task.state == 'PENDING':
        return jsonify({"state": task.state, "status": "Task is waiting in the broker queue..."}), 200
    elif task.state != 'FAILURE':
        # 4. Storage Hook: Only reached dynamically on complete successful resolution
        result_payload = task.info
        return jsonify({
            "state": task.state, 
            "result": result_payload
        }), 200
    else:
        return jsonify({"state": task.state, "status": str(task.info)}), 500

@review_bp.route('/review/history', methods=['GET'])
@token_required
def review_history(current_user_email):
    """
    Extracts the authenticated user's complete analysis repository.
    """
    try:
        history = get_reviews_by_user(current_user_email)
        return jsonify({"history": history}), 200
    except Exception as e:
        logging.error(f"Failed to extract review history: {e}")
        return jsonify({"error": "Failed to map history parameters.", "history": []}), 500
