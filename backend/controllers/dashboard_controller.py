from flask import request, jsonify

from services.dashboard_service import (
    get_dashboard_stats,
    get_dashboard_analytics,
    get_traffic_history,
    get_traffic_summary
)


def dashboard_stats():
    stats = get_dashboard_stats()
    return jsonify(stats), 200


def dashboard_analytics():
    analytics = get_dashboard_analytics()
    return jsonify(analytics), 200


def traffic_history():
    signal_id = request.args.get("signal_id", type=int)
    congestion_level = request.args.get("congestion_level", type=str)
    limit = request.args.get("limit", default=100, type=int)

    history = get_traffic_history(
        signal_id=signal_id,
        congestion_level=congestion_level,
        limit=limit
    )

    return jsonify({
        "success": True,
        "data": history
    }), 200


def traffic_summary():
    summary = get_traffic_summary()
    return jsonify({
        "success": True,
        "data": summary
    }), 200