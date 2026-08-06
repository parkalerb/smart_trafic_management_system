import bcrypt

from models import User
from database.db import db


def register_user(data):
    """
    Register a new user.
    """

    existing_user = User.query.filter_by(email=data["email"]).first()

    if existing_user:
        return {
            "success": False,
            "message": "Email already registered."
        }

    hashed_password = bcrypt.hashpw(
        data["password"].encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        password=hashed_password,
        role=data.get("role", "ADMIN")
    )

    db.session.add(user)
    db.session.commit()

    return {
        "success": True,
        "message": "User registered successfully.",
        "data": user.to_dict()
    }


def login_user(data):
    """
    Authenticate user.
    """

    user = User.query.filter_by(email=data["email"]).first()

    if user is None:
        return {
            "success": False,
            "message": "Invalid email or password."
        }

    password_matched = bcrypt.checkpw(
        data["password"].encode("utf-8"),
        user.password.encode("utf-8")
    )

    if not password_matched:
        return {
            "success": False,
            "message": "Invalid email or password."
        }

    return {
        "success": True,
        "message": "Login successful.",
        "data": user.to_dict()
    }


def get_all_users():
    """
    Fetch all users.
    """

    users = User.query.all()

    return [user.to_dict() for user in users]


def get_user_by_id(user_id):
    """
    Fetch user by ID.
    """

    user = User.query.get(user_id)

    if user is None:
        return None

    return user.to_dict()


def update_user(user_id, data):
    """
    Update user details.
    """

    user = User.query.get(user_id)

    if user is None:
        return None

    user.full_name = data.get("full_name", user.full_name)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)
    user.is_active = data.get("is_active", user.is_active)

    db.session.commit()

    return user.to_dict()


def delete_user(user_id):
    """
    Delete a user.
    """

    user = User.query.get(user_id)

    if user is None:
        return False

    db.session.delete(user)
    db.session.commit()

    return True