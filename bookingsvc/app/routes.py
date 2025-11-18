from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, r
from app.models import Booking

bp = Blueprint("bookings", __name__)

LOCK_TTL_SEC = 300  # 5 minutes

@bp.get("/health")
def health():
    return jsonify(status="ok", service="bookingsvc")

def _lock_key(event_id, user_id):
    return f"lock:event:{event_id}:user:{user_id}"

@bp.post("/api/lock")
@jwt_required()
def lock_seats():
    data = request.get_json(force=True)
    event_id = data.get("event_id")
    seats = data.get("seats")
    if not event_id or not seats or int(seats) <= 0:
        return jsonify(error="event_id and positive seats are required"), 400

    user_id = get_jwt_identity()  # string per usersvc change
    key = _lock_key(event_id, user_id)

    # value we store in redis
    value = f"{event_id}:{seats}"

    # SET NX with expiry → only if not already locked
    ok = r.set(key, value, ex=LOCK_TTL_SEC, nx=True)
    if not ok:
        ttl = r.ttl(key)
        return jsonify(error="seat lock already exists for this user/event", ttl=ttl), 409

    return jsonify(message="seats locked", event_id=int(event_id), seats=int(seats), ttl=LOCK_TTL_SEC), 201

@bp.post("/api/confirm")
@jwt_required()
def confirm_booking():
    data = request.get_json(force=True)
    event_id = data.get("event_id")
    if not event_id:
        return jsonify(error="event_id is required"), 400

    user_id = get_jwt_identity()
    key = _lock_key(event_id, user_id)
    value = r.get(key)
    if not value:
        return jsonify(error="no active lock for this user/event"), 404

    try:
        _event_id_str, seats_str = value.split(":")
        seats = int(seats_str)
    except Exception:
        return jsonify(error="corrupt lock value"), 500

    booking = Booking(user_id=int(user_id), event_id=int(event_id), seats=seats, status="CONFIRMED")
    db.session.add(booking)
    db.session.commit()

    r.delete(key)

    return jsonify(message="booking confirmed", booking=booking.to_dict()), 201

@bp.get("/api/bookings")
@jwt_required()
def my_bookings():
    user_id = get_jwt_identity()
    rows = Booking.query.filter_by(user_id=int(user_id)).order_by(Booking.created_at.desc()).all()
    return jsonify([b.to_dict() for b in rows]), 200
