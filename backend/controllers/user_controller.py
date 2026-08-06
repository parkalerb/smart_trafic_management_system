from flask import request, jsonify

from services.user_service import (
    register_user,
    login_user,
    get_all_users,
    get_user_by_id,
    update_user,
    delete_user
)


def register():

    data = request.get_json()

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

    return jsonify(result), 201


def login():

    data = request.get_json()

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

    return jsonify(result), 200


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

    data = request.get_json()

    user = update_user(user_id, data)

    if user is None:
        return jsonify({
            "message": "User not found"
        }), 404

    return jsonify({
        "message": "User updated successfully",
        "data": user
    }), 200


def remove_user(user_id):

    deleted = delete_user(user_id)

    if not deleted:
        return jsonify({
            "message": "User not found"
        }), 404

    return jsonify({
        "message": "User deleted successfully"
    }), 200