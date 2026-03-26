from flask import Blueprint, request, jsonify
from ..services.auth_service import register_user, login_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('full_name'):
        return jsonify({"error": "Strict schema violation. Email, password, and full name required."}), 400
    response, code = register_user(data['email'], data['password'], data['full_name'])
    return jsonify(response), code

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Strict schema violation. Email and password required."}), 400
    response, code = login_user(data['email'], data['password'])
    return jsonify(response), code


