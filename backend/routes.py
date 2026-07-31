from controllers.signal_controller import (
    get_signals,
    get_signal,
    add_signal,
    edit_signal,
    remove_signal
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