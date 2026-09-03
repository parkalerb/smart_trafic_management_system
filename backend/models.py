from database.db import db
from datetime import datetime


class TrafficSignal(db.Model):

    __tablename__ = "traffic_signals"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100), nullable=False)
    green_time = db.Column(db.Integer, nullable=False)
    yellow_time = db.Column(db.Integer, nullable=False)
    red_time = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="ACTIVE")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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


class AuditLog(db.Model):

    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    actor_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    action = db.Column(db.String(50), nullable=False)
    target_user_id = db.Column(db.Integer, nullable=True)
    target_name = db.Column(db.String(100), nullable=True)
    target_email = db.Column(db.String(120), nullable=True)
    details = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    actor = db.relationship("User", foreign_keys=[actor_user_id], backref=db.backref("audit_logs", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "actor_user_id": self.actor_user_id,
            "actor_name": self.actor.full_name if self.actor else "System",
            "actor_email": self.actor.email if self.actor else "system@traffic.com",
            "action": self.action,
            "target_user_id": self.target_user_id,
            "target_name": self.target_name or "N/A",
            "target_email": self.target_email or "N/A",
            "details": self.details,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }