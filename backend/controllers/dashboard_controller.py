from flask import jsonify

from services.dashboard_service import get_dashboard_stats


def dashboard_stats():

    stats = get_dashboard_stats()

    return jsonify(stats), 200
from flask import jsonify

from services.dashboard_service import (
    get_dashboard_stats,
    get_dashboard_analytics
)


def dashboard_stats():

    stats = get_dashboard_stats()

    return jsonify(stats), 200


def dashboard_analytics():

    analytics = get_dashboard_analytics()

    return jsonify(analytics), 200