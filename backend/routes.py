from controllers.signal_controller import (
    get_signals,
    get_signal,
    add_signal,
    edit_signal,
    remove_signal
)


def register_routes(app):

    @app.route("/")
    def home():
        return {
            "project": "Smart Traffic Management System",
            "status": "Backend Running"
        }

    @app.route("/signals", methods=["GET"])
    def all_signals():
        return get_signals()

    @app.route("/signals/<int:signal_id>", methods=["GET"])
    def single_signal(signal_id):
        return get_signal(signal_id)

    @app.route("/signals", methods=["POST"])
    def create_signal_route():
        return add_signal()

    @app.route("/signals/<int:signal_id>", methods=["PUT"])
    def update_signal_route(signal_id):
        return edit_signal(signal_id)

    @app.route("/signals/<int:signal_id>", methods=["DELETE"])
    def delete_signal_route(signal_id):
        return remove_signal(signal_id)