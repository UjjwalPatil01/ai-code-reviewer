from flask import jsonify
from werkzeug.exceptions import HTTPException
import logging

logger = logging.getLogger(__name__)

def register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        """Return JSON instead of HTML for HTTP errors."""
        response = e.get_response()
        response.data = jsonify({
            "error": e.description,
            "status_code": e.code
        }).data
        response.content_type = "application/json"
        return response

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        """Catch all other exceptions and return a clean 500 JSON response."""
        logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
        return jsonify({
            "error": "An unexpected internal server error occurred.",
            "message": str(e)
        }), 500
        
    @app.errorhandler(ValueError)
    def handle_value_error(e):
        """Catch structural API errors."""
        logger.warning(f"Value Error: {str(e)}")
        return jsonify({
            "error": "Validation or Configuration Error",
            "message": str(e)
        }), 400
