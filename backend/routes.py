from controllers.signal_controller import (
    get_signals,
    get_signal,
    add_signal,
    edit_signal,
    remove_signal,
    search_signal,
    filter_signal
)

from controllers.user_controller import (
    register,
    add_user,
    login,
    logout,
    get_current_user,
    get_users,
    get_user,
    edit_user,
    remove_user
)
from controllers.dashboard_controller import (
    dashboard_stats,
    dashboard_analytics
)

from controllers.detection_controller import (
    trigger_detection,
    fetch_detection_status
)

from utils.auth_middleware import require_role


def register_routes(app):

    # Public Routes
    @app.route("/")
    def home():
        return {
            "message": "Smart Traffic Management System API is Running..."
        }

    @app.route("/users/register", methods=["POST"])
    def register_user_route():
        return register()

    @app.route("/users/login", methods=["POST"])
    def login_user_route():
        return login()

    @app.route("/users/logout", methods=["POST"])
    def logout_user_route():
        return logout()

    @app.route("/users/me", methods=["GET"])
    @require_role(["ADMIN", "OPERATOR", "USER"])
    def fetch_current_user_route():
        return get_current_user()

    # Traffic Signal Routes - Viewable by ALL roles
    @app.route("/signals", methods=["GET"])
    @require_role(["ADMIN", "OPERATOR", "USER"])
    def fetch_all_signals():
        return get_signals()

    @app.route("/signals/search", methods=["GET"])
    @require_role(["ADMIN", "OPERATOR", "USER"])
    def search_signal_route():
        return search_signal()

    @app.route("/signals/filter", methods=["GET"])
    @require_role(["ADMIN", "OPERATOR", "USER"])
    def filter_signal_route():
        return filter_signal()

    @app.route("/signals/<int:signal_id>", methods=["GET"])
    @require_role(["ADMIN", "OPERATOR", "USER"])
    def fetch_signal(signal_id):
        return get_signal(signal_id)

    # Traffic Signal Creation & Modification - ADMIN and OPERATOR only
    @app.route("/signals", methods=["POST"])
    @require_role(["ADMIN", "OPERATOR"])
    def create_new_signal():
        return add_signal()

    @app.route("/signals/<int:signal_id>", methods=["PUT"])
    @require_role(["ADMIN", "OPERATOR"])
    def update_existing_signal(signal_id):
        return edit_signal(signal_id)

    # Traffic Signal Deletion - ADMIN only
    @app.route("/signals/<int:signal_id>", methods=["DELETE"])
    @require_role(["ADMIN"])
    def delete_existing_signal(signal_id):
        return remove_signal(signal_id)

    # User Management Routes - ADMIN only
    @app.route("/users", methods=["GET"])
    @require_role(["ADMIN"])
    def fetch_all_users():
        return get_users()

    @app.route("/users", methods=["POST"])
    @require_role(["ADMIN"])
    def create_user_route():
        return add_user()

    @app.route("/users/<int:user_id>", methods=["GET"])
    @require_role(["ADMIN"])
    def fetch_user(user_id):
        return get_user(user_id)

    @app.route("/users/<int:user_id>", methods=["PUT"])
    @require_role(["ADMIN"])
    def update_user_route(user_id):
        return edit_user(user_id)

    @app.route("/users/<int:user_id>", methods=["DELETE"])
    @require_role(["ADMIN"])
    def delete_user_route(user_id):
        return remove_user(user_id)

    # Dashboard & Analytics - Viewable by ALL roles
    @app.route("/dashboard/stats", methods=["GET"])
    @require_role(["ADMIN", "OPERATOR", "USER"])
    def get_dashboard_statistics():
        return dashboard_stats()

    @app.route("/dashboard/analytics", methods=["GET"])
    @require_role(["ADMIN", "OPERATOR", "USER"])
    def get_dashboard_analytics_route():
        return dashboard_analytics()

    # OpenCV Detection Routes
    @app.route("/detection/status/<int:signal_id>", methods=["GET"])
    @require_role(["ADMIN", "OPERATOR", "USER"])
    def get_detection_status_route(signal_id):
        return fetch_detection_status(signal_id)

    @app.route("/detection/process", methods=["POST"])
    @require_role(["ADMIN", "OPERATOR"])
    def process_detection_route():
        return trigger_detection()