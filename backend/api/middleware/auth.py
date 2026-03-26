import jwt
import os
from functools import wraps
from flask import request, jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]
            
        if not token:
            return jsonify({'error': 'Authentication Token is missing or malformed!', 'auth_required': True}), 401
            
        try:
            secret = os.environ.get('JWT_SECRET', 'nexus_ai_super_secret_production_key_123!')
            data = jwt.decode(token, secret, algorithms=["HS256"])
            current_user_email = data['email']
        except Exception as e:
            return jsonify({'error': 'Token is strictly invalid or expired!', 'auth_required': True}), 401
            
        return f(current_user_email, *args, **kwargs)
    return decorated
