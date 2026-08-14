from flask import request, jsonify
from services.detection_service import (
    run_detection_for_signal,
    get_signal_detection_status
)

def trigger_detection():
    data = request.get_json() or {}

    if "signal_id" not in data:
        return jsonify({
            "success": False,
            "message": "signal_id is required"
        }), 400

    signal_id = data["signal_id"]
    update_db = data.get("update_db", True)
    image_base64 = data.get("image", None)

    result = run_detection_for_signal(signal_id, update_db=update_db, image_base64=image_base64)

    if not result["success"]:
        return jsonify(result), 404

    return jsonify(result), 200

def fetch_detection_status(signal_id):
    status = get_signal_detection_status(signal_id)

    if status is None:
        return jsonify({
            "success": False,
            "message": "Traffic signal not found"
        }), 404

    return jsonify({
        "success": True,
        "data": status
    }), 200
