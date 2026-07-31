from models import TrafficSignal
from database.db import db


def get_all_signals():
    """
    Fetch all traffic signals.
    """
    signals = TrafficSignal.query.all()
    return [signal.to_dict() for signal in signals]


def get_signal_by_id(signal_id):
    """
    Fetch a traffic signal by ID.
    """
    signal = TrafficSignal.query.get(signal_id)

    if signal is None:
        return None

    return signal.to_dict()


def create_signal(data):
    """
    Create a new traffic signal.
    """

    signal = TrafficSignal(
        location=data["location"],
        green_time=data["green_time"],
        yellow_time=data["yellow_time"],
        red_time=data["red_time"],
        status=data.get("status", "ACTIVE")
    )

    db.session.add(signal)
    db.session.commit()

    return signal.to_dict()


def update_signal(signal_id, data):
    """
    Update an existing traffic signal.
    """

    signal = TrafficSignal.query.get(signal_id)

    if signal is None:
        return None

    signal.location = data.get("location", signal.location)
    signal.green_time = data.get("green_time", signal.green_time)
    signal.yellow_time = data.get("yellow_time", signal.yellow_time)
    signal.red_time = data.get("red_time", signal.red_time)
    signal.status = data.get("status", signal.status)

    db.session.commit()

    return signal.to_dict()


def delete_signal(signal_id):
    """
    Delete a traffic signal.
    """

    signal = TrafficSignal.query.get(signal_id)

    if signal is None:
        return False

    db.session.delete(signal)
    db.session.commit()

    return True