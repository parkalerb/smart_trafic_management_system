from flask import jsonify, request

from services.signal_service import (
    get_all_signals,
    get_signal_by_id,
    create_signal,
    update_signal,
    delete_signal
)


def get_signals():
    signals = get_all_signals()
    return jsonify(signals)


def get_signal(signal_id):
    signal = get_signal_by_id(signal_id)
    return jsonify(signal)


def add_signal():
    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is missing"
        }), 400

    result = create_signal(data)
    return jsonify(result), 201


def edit_signal(signal_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is missing"
        }), 400

    result = update_signal(signal_id, data)

    if result.get("message") == "Signal not found":
        return jsonify(result), 404

    return jsonify(result)


def remove_signal(signal_id):
    result = delete_signal(signal_id)

    if result.get("message") == "Signal not found":
        return jsonify(result), 404

    return jsonify(result)