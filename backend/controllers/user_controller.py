from flask import request, jsonify, session

from services.user_service import (
    register_user,
    login_user,
    get_all_users,
    get_user_by_id,
    update_user,
    delete_user
)


def register():
    data = request.get_json() or {}

    required_fields = [
        "full_name",
        "email",
        "password"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "message": f"{field} is required"
            }), 400

    result = register_user(data)

    if not result["success"]:
        return jsonify(result), 400

    # Automatically log in new user by creating server-side session
    session["user_id"] = result["data"]["id"]

    return jsonify(result), 201


def login():
    data = request.get_json() or {}

    required_fields = [
        "email",
        "password"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "message": f"{field} is required"
            }), 400

    result = login_user(data)

    if not result["success"]:
        return jsonify(result), 401

    # Store authenticated user ID in Flask's cryptographically signed session
    session["user_id"] = result["data"]["id"]

    return jsonify(result), 200


def logout():
    session.clear()
    return jsonify({
        "success": True,
        "message": "Logged out successfully."
    }), 200


def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "success": False,
            "message": "No active session."
        }), 401

    user = get_user_by_id(user_id)

    if not user:
        session.clear()
        return jsonify({
            "success": False,
            "message": "User account not found."
        }), 401

    return jsonify({
        "success": True,
        "data": user
    }), 200


def get_users():
    users = get_all_users()
    return jsonify(users), 200


def get_user(user_id):
    user = get_user_by_id(user_id)

    if user is None:
        return jsonify({
            "message": "User not found"
        }), 404

    return jsonify(user), 200


def edit_user(user_id):
    data = request.get_json() or {}

    result = update_user(user_id, data)

    if not result["success"]:
        status_code = 404 if result.get("message") == "User not found" else 400
        return jsonify(result), status_code

    return jsonify(result), 200


def remove_user(user_id):
    result = delete_user(user_id)

    if not result["success"]:
        status_code = 404 if result.get("message") == "User not found" else 400
        return jsonify(result), status_code

    return jsonify(result), 200