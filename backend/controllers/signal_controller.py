from flask import request, jsonify

from services.signal_service import (
    get_all_signals,
    get_signal_by_id,
    create_signal,
    update_signal,
    delete_signal
)


def get_signals():
    signals = get_all_signals()
    return jsonify(signals), 200


def get_signal(signal_id):
    signal = get_signal_by_id(signal_id)

    if signal is None:
        return jsonify({"message": "Traffic signal not found"}), 404

    return jsonify(signal), 200


def add_signal():
    data = request.get_json()

    required_fields = [
        "location",
        "green_time",
        "yellow_time",
        "red_time"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    signal = create_signal(data)

    return jsonify({
        "message": "Traffic signal created successfully",
        "data": signal
    }), 201


def edit_signal(signal_id):
    data = request.get_json()

    signal = update_signal(signal_id, data)

    if signal is None:
        return jsonify({"message": "Traffic signal not found"}), 404

    return jsonify({
        "message": "Traffic signal updated successfully",
        "data": signal
    }), 200


def remove_signal(signal_id):
    deleted = delete_signal(signal_id)

    if not deleted:
        return jsonify({"message": "Traffic signal not found"}), 404

    return jsonify({
        "message": "Traffic signal deleted successfully"
    }), 200