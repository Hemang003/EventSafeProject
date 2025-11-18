from datetime import datetime
from app import db

class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    event_id = db.Column(db.Integer, nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default="CONFIRMED")  # could be PENDING/CANCELLED
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "seats": self.seats,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
