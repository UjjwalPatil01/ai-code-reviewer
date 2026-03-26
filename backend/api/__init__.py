from flask import Flask
from flask_cors import CORS
from .routes.review import review_bp
from .routes.auth import auth_bp
from .middleware.error_handler import register_error_handlers
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import logging

logging.basicConfig(level=logging.INFO)

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["250 per day", "50 per hour"],
    storage_uri=os.environ.get("REDIS_URL", "memory://")
)

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for frontend API origins
    CORS(app)
    
    # Secure API against basic volumetric attacks
    limiter.init_app(app)
    
    # Register global error middleware
    register_error_handlers(app)
    
    # Register blueprints
    app.register_blueprint(review_bp, url_prefix='/api/v1')
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    
    @app.route('/')
    def index():
        return {
            "status": "online", 
            "message": "AI Code Review API is running. The frontend is located at localhost:5173",
            "endpoints": ["/health", "/api/v1/review"]
        }, 200
        
    @app.route('/health')
    def health_check():
        return {"status": "healthy"}, 200
        
    return app
