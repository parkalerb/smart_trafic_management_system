from database.db import db
from datetime import datetime

class TrafficSignal(db.Model):

    __tablename__ = "traffic_signals"

    id = db.Column(db.Integer, primary_key=True)

    location = db.Column(db.String(100), nullable=False)

    green_time = db.Column(db.Integer, nullable=False)

    yellow_time = db.Column(db.Integer, nullable=False)

    red_time = db.Column(db.Integer, nullable=False)

    status = db.Column(
        db.String(20),
        nullable=False,
        default="ACTIVE"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "location": self.location,
            "green_time": self.green_time,
            "yellow_time": self.yellow_time,
            "red_time": self.red_time,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }