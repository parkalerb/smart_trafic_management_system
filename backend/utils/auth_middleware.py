from functools import wraps
from flask import session, jsonify
from models import User

def require_role(allowed_roles):
    """
    Cryptographically signed session-based authorization decorator.
    Reads user identity strictly from Flask's server-side session (session['user_id']).
    Client HTTP headers (X-User-Id / X-User-Role) are completely ignored.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Extract authenticated user identity from Flask's cryptographically signed session
            user_id = session.get("user_id")

            if not user_id:
                return jsonify({
                    "success": False,
                    "message": "Authentication required. Please log in."
                }), 401

            # Fetch authoritative user record directly from MySQL database
            user = User.query.get(user_id)

            if not user:
                session.clear()
                return jsonify({
                    "success": False,
                    "message": "Authenticated user record not found."
                }), 401

            if not user.is_active:
                return jsonify({
                    "success": False,
                    "message": "User account is disabled or inactive."
                }), 401

            # Evaluate server-verified database role against allowed_roles
            if user.role not in allowed_roles:
                return jsonify({
                    "success": False,
                    "message": f"Access denied. User role '{user.role}' is not authorized for this operation."
                }), 403

            return f(*args, **kwargs)

        return decorated_function
    return decorator
