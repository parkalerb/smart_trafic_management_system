from database.db import db
from datetime import datetime

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
