from ..schemas.review import ReviewResponse, ReviewIssue
from .ai_service import generate_code_review
from ..db.repositories.review_repository import save_review
import logging

def process_review_request(code: str, language: str, user_email: str = None):
    """
    Service to handle the core logic of code review.
    Returns (response_dict, status_code)
    """
    # Call the AI Engine
    response_obj = generate_code_review(code, language)
    response_dict = response_obj.to_dict()
    
    # Store structured results inside MongoDB layer securely tying to User
    try:
        doc_id = save_review(code, language, response_dict, user_email)
        response_dict['review_id'] = str(doc_id)
    except Exception as db_err:
        logging.getLogger(__name__).warning(f"MongoDB not reachable, skipping persist: {db_err}")
        response_dict['review_id'] = "local-unpersisted"
    
    return response_dict, 200
