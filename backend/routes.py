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
    login,
    get_users,
    get_user,
    edit_user,
    remove_user
)
from controllers.dashboard_controller import (
    dashboard_stats,
    dashboard_analytics
)


def register_routes(app):

    # Home Route
    @app.route("/")
    def home():
        return {
            "message": "Smart Traffic Management System API is Running..."
        }

    # Traffic Signal Routes

    @app.route("/signals", methods=["GET"])
    def fetch_all_signals():
        return get_signals()

    @app.route("/signals/search", methods=["GET"])
    def search_signal_route():
        return search_signal()
    
    @app.route("/signals/filter", methods=["GET"])
    def filter_signal_route():
        return filter_signal()


    @app.route("/signals/<int:signal_id>", methods=["GET"])
    def fetch_signal(signal_id):
        return get_signal(signal_id)


    @app.route("/signals", methods=["POST"])
    def create_new_signal():
        return add_signal()


    @app.route("/signals/<int:signal_id>", methods=["PUT"])
    def update_existing_signal(signal_id):
        return edit_signal(signal_id)


    @app.route("/signals/<int:signal_id>", methods=["DELETE"])
    def delete_existing_signal(signal_id):
        return remove_signal(signal_id)

    @app.route("/users/register", methods=["POST"])
    def register_user_route():
        return register()


    @app.route("/users/login", methods=["POST"])
    def login_user_route():
        return login()


    @app.route("/users", methods=["GET"])
    def fetch_all_users():
        return get_users()


    @app.route("/users/<int:user_id>", methods=["GET"])
    def fetch_user(user_id):
        return get_user(user_id)


    @app.route("/users/<int:user_id>", methods=["PUT"])
    def update_user_route(user_id):
        return edit_user(user_id)


    @app.route("/users/<int:user_id>", methods=["DELETE"])
    def delete_user_route(user_id):
        return remove_user(user_id)

    @app.route("/dashboard/stats", methods=["GET"])
    def get_dashboard_statistics():
        return dashboard_stats()

    @app.route("/dashboard/analytics", methods=["GET"])
    def get_dashboard_analytics_route():
        return dashboard_analytics()