from models import TrafficSignal, User, TrafficDetection
from database.db import db
from sqlalchemy import func

def get_dashboard_stats():

    total_signals = TrafficSignal.query.count()

    active_signals = TrafficSignal.query.filter_by(
        status="ACTIVE"
    ).count()

    inactive_signals = TrafficSignal.query.filter_by(
        status="INACTIVE"
    ).count()

    total_users = User.query.count()

    return {
        "total_signals": total_signals,
        "active_signals": active_signals,
        "inactive_signals": inactive_signals,
        "total_users": total_users
    }


def get_dashboard_analytics():

    total_green_time = db.session.query(
        func.sum(TrafficSignal.green_time)
    ).scalar() or 0

    average_green_time = db.session.query(
        func.avg(TrafficSignal.green_time)
    ).scalar() or 0

    maximum_green_time = db.session.query(
        func.max(TrafficSignal.green_time)
    ).scalar() or 0

    minimum_green_time = db.session.query(
        func.min(TrafficSignal.green_time)
    ).scalar() or 0

    total_signals = TrafficSignal.query.count()

    active_signals = TrafficSignal.query.filter_by(
        status="ACTIVE"
    ).count()

    inactive_signals = TrafficSignal.query.filter_by(
        status="INACTIVE"
    ).count()

    if total_signals > 0:
        active_percentage = round(
            (active_signals / total_signals) * 100,
            2
        )

        inactive_percentage = round(
            (inactive_signals / total_signals) * 100,
            2
        )
    else:
        active_percentage = 0
        inactive_percentage = 0

    return {
        "total_green_time": total_green_time,
        "average_green_time": round(average_green_time, 2),
        "maximum_green_time": maximum_green_time,
        "minimum_green_time": minimum_green_time,
        "active_percentage": active_percentage,
        "inactive_percentage": inactive_percentage
    }


def get_traffic_history(signal_id=None, congestion_level=None, limit=100):
    """
    Fetch recent traffic detection history with optional filters.
    """
    query = TrafficDetection.query
    if signal_id:
        query = query.filter_by(signal_id=signal_id)
    if congestion_level:
        query = query.filter_by(congestion_level=congestion_level)

    detections = query.order_by(TrafficDetection.detected_at.desc()).limit(limit).all()
    return [d.to_dict() for d in detections]


def get_traffic_summary():
    """
    Compute summary metrics over all detection history records.
    """
    total_detections = TrafficDetection.query.count()

    total_vehicles = db.session.query(
        func.sum(TrafficDetection.vehicle_count)
    ).scalar() or 0

    average_vehicle_count = db.session.query(
        func.avg(TrafficDetection.vehicle_count)
    ).scalar() or 0

    low_congestion = TrafficDetection.query.filter_by(congestion_level="LOW").count()
    medium_congestion = TrafficDetection.query.filter_by(congestion_level="MEDIUM").count()
    high_congestion = TrafficDetection.query.filter_by(congestion_level="HIGH").count()

    average_green_time = db.session.query(
        func.avg(TrafficDetection.green_time)
    ).scalar() or 0

    return {
        "total_detections": total_detections,
        "total_vehicles": total_vehicles,
        "average_vehicle_count": round(average_vehicle_count, 1),
        "low_congestion": low_congestion,
        "medium_congestion": medium_congestion,
        "high_congestion": high_congestion,
        "average_green_time": round(average_green_time, 1)
    }