from models import TrafficSignal
from database.db import db


def get_all_signals():
    signals = TrafficSignal.query.all()
    return [signal.to_dict() for signal in signals]


def get_signal_by_id(signal_id):
    signal = TrafficSignal.query.get(signal_id)

    if signal:
        return signal.to_dict()

    return {
        "message": "Signal not found"
    }


def create_signal(data):
    signal = TrafficSignal(
        location=data["location"],
        green_time=data["green_time"],
        yellow_time=data["yellow_time"],
        red_time=data["red_time"],
        status=data.get("status", "ACTIVE")
    )

    db.session.add(signal)
    db.session.commit()

    return {
        "message": "Traffic signal created successfully",
        "data": signal.to_dict()
    }


def update_signal(signal_id, data):
    signal = TrafficSignal.query.get(signal_id)

    if not signal:
        return {
            "message": "Signal not found"
        }

    signal.location = data["location"]
    signal.green_time = data["green_time"]
    signal.yellow_time = data["yellow_time"]
    signal.red_time = data["red_time"]
    signal.status = data.get("status", signal.status)

    db.session.commit()

    return {
        "message": "Traffic signal updated successfully",
        "data": signal.to_dict()
    }


def delete_signal(signal_id):
    signal = TrafficSignal.query.get(signal_id)

    if not signal:
        return {
            "message": "Signal not found"
        }

    db.session.delete(signal)
    db.session.commit()

    return {
        "message": "Traffic signal deleted successfully"
    }