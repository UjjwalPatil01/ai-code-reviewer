import bcrypt
import jwt
import os
import datetime
import logging
from ..db.repositories.user_repository import create_user, get_user_by_email

JWT_SECRET = os.environ.get('JWT_SECRET', 'nexus_ai_super_secret_production_key_123!')

def generate_jwt(email):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'email': email
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def register_user(email, password, full_name=None):
    user = get_user_by_email(email)
    if user:
        return {"error": "User already exists"}, 400
        
    try:
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        create_user(email, hashed_pw.decode('utf-8'), full_name=full_name, is_verified=True)
        
        token = generate_jwt(email)
        return {"token": token, "email": email, "full_name": full_name, "message": "Account created successfully."}, 201
    except Exception as e:
        logging.error(f"Registration Error: {e}")
        return {"error": "Database error preventing registration."}, 500

def login_user(email, password):
    user = get_user_by_email(email)
    if not user or not user.get('password'):
        return {"error": "Invalid email or password."}, 401
        
    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        token = generate_jwt(email)
        return {"token": token, "email": email, "full_name": user.get('full_name'), "message": "Login successful."}, 200
        
    return {"error": "Invalid email or password."}, 401
