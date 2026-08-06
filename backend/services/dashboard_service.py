from models import TrafficSignal, User
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