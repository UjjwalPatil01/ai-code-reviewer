MAX_CODE_LENGTH = 10000
SUPPORTED_LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin']

def validate_review_request(data):
    """
    Validates the incoming review request.
    Returns (is_valid, error_message, status_code).
    """
    if not data:
        return False, "Request body must be valid JSON.", 400
        
    code = data.get('code')
    language = data.get('language')
    
    # 1. Code must exist
    if not code:
        return False, "The 'code' field is required and cannot be empty.", 400
        
    if not isinstance(code, str):
        return False, "The 'code' field must be a string.", 400
        
    # 2. Enforce size limits
    if len(code) > MAX_CODE_LENGTH:
        return False, f"Code exceeds maximum length of {MAX_CODE_LENGTH} characters.", 413
        
    # 3. Language must be valid
    if not language:
        return False, "The 'language' field is required.", 400
        
    if not isinstance(language, str):
        return False, "The 'language' field must be a string.", 400
        
    language_lower = language.lower()
    if language_lower not in SUPPORTED_LANGUAGES:
        return False, f"Unsupported language: {language}. Supported languages are: {', '.join(SUPPORTED_LANGUAGES)}.", 400
        
    return True, None, 200
