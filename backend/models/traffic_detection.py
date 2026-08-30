from database.db import db
from datetime import datetime

class TrafficDetection(db.Model):
    __tablename__ = "traffic_detections"

    id = db.Column(db.Integer, primary_key=True)
    signal_id = db.Column(db.Integer, db.ForeignKey("traffic_signals.id"), nullable=False)
    vehicle_count = db.Column(db.Integer, nullable=False)
    congestion_level = db.Column(db.String(20), nullable=False)
    green_time = db.Column(db.Integer, nullable=False)
    detected_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    signal = db.relationship("TrafficSignal", backref=db.backref("detections", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "signal_id": self.signal_id,
            "location": self.signal.location if self.signal else f"Signal #{self.signal_id}",
            "vehicle_count": self.vehicle_count,
            "congestion_level": self.congestion_level,
            "green_time": self.green_time,
            "detected_at": self.detected_at.isoformat() if self.detected_at else None
        }
