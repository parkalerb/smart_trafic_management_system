import bcrypt

from models import User
from database.db import db


def register_user(data):
    """
    Register a new public user.
    Public registration is strictly forced to role='USER'.
    Client-supplied role parameters are ignored to prevent privilege escalation.
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
        role="USER"  # Hard-enforced server-side: public registration ALWAYS creates USER accounts
    )

    db.session.add(user)
    db.session.commit()

    return {
        "success": True,
        "message": "User registered successfully.",
        "data": user.to_dict()
    }


def create_user_admin(data):
    """
    Create a new user by an authenticated ADMIN.
    Allows ADMIN to explicitly assign any valid role (USER, OPERATOR, ADMIN) and status (is_active).
    """

    existing_user = User.query.filter_by(email=data["email"]).first()

    if existing_user:
        return {
            "success": False,
            "message": "Email already registered."
        }

    role = data.get("role", "USER")
    if role not in ["USER", "OPERATOR", "ADMIN"]:
        return {
            "success": False,
            "message": "Invalid role specified."
        }

    hashed_password = bcrypt.hashpw(
        data["password"].encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        password=hashed_password,
        role=role,
        is_active=bool(data.get("is_active", True))
    )

    db.session.add(user)
    db.session.commit()

    return {
        "success": True,
        "message": "User account created successfully.",
        "data": user.to_dict()
    }


def login_user(data):
    """
    Authenticate user credentials.
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
    Fetch all users directory.
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
    Update user details with Last Admin Protection.
    """

    user = User.query.get(user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found"
        }

    new_role = data.get("role", user.role)
    new_active = data.get("is_active", user.is_active)

    # Last Admin Protection: Prevent demoting or deactivating the final remaining administrator
    if user.role == "ADMIN" and (new_role != "ADMIN" or not new_active):
        active_admin_count = User.query.filter_by(role="ADMIN", is_active=True).count()
        if active_admin_count <= 1:
            return {
                "success": False,
                "message": "Cannot delete or demote the last administrator."
            }

    user.full_name = data.get("full_name", user.full_name)
    user.email = data.get("email", user.email)
    user.role = new_role
    user.is_active = new_active

    db.session.commit()

    return {
        "success": True,
        "message": "User updated successfully",
        "data": user.to_dict()
    }


def delete_user(user_id):
    """
    Delete a user account with Last Admin Protection.
    """

    user = User.query.get(user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found"
        }

    # Last Admin Protection: Prevent deleting the final remaining administrator
    if user.role == "ADMIN":
        admin_count = User.query.filter_by(role="ADMIN").count()
        if admin_count <= 1:
            return {
                "success": False,
                "message": "Cannot delete or demote the last administrator."
            }

    db.session.delete(user)
    db.session.commit()

    return {
        "success": True,
        "message": "User deleted successfully"
    }