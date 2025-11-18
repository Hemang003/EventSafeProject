# eventsvc/app/routes.py
from flask import Blueprint, request, jsonify, send_from_directory
from datetime import datetime
from werkzeug.utils import secure_filename
import os

from app import db
from app.models import Event

bp = Blueprint("events_api", __name__)

# ------------ helpers ------------

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
POSTERS_DIR = os.path.join(BASE_DIR, "static", "posters")
os.makedirs(POSTERS_DIR, exist_ok=True)


def parse_datetime(value):
    if not value:
        return None
    try:
        # input is "YYYY-MM-DDTHH:MM"
        return datetime.fromisoformat(value)
    except ValueError:
        return None


# ------------ API ROUTES ------------

@bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "eventsvc"})


# GET /events/api/events  (via gateway)
@bp.route("/api/events", methods=["GET"])
def list_events():
    events = Event.query.order_by(Event.date.asc()).all()
    return jsonify([e.to_dict() for e in events])


# GET /events/api/events/<id>
@bp.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify(event.to_dict())


# POST /events/api/events
@bp.route("/api/events", methods=["POST"])
def create_event():
    data = request.get_json() or {}

    title = data.get("title")
    date = parse_datetime(data.get("date"))
    venue = data.get("venue")
    total_seats = data.get("total_seats")

    if not title or not date or not venue or not total_seats:
        return jsonify({"error": "title, date, venue and total_seats are required"}), 400

    try:
        total_seats = int(total_seats)
    except (TypeError, ValueError):
        return jsonify({"error": "total_seats must be an integer"}), 400

    description = data.get("description")
    image_url = data.get("image_url")
    price = data.get("price")
    category = data.get("category")
    city = data.get("city")
    country = data.get("country")
    organizer = data.get("organizer")
    language = data.get("language")
    expiry_date = parse_datetime(data.get("expiry_date"))

    if price is not None:
        try:
            price = float(price)
        except (TypeError, ValueError):
            return jsonify({"error": "price must be numeric"}), 400

    event = Event(
        title=title,
        date=date,
        venue=venue,
        total_seats=total_seats,
        available_seats=total_seats,
        description=description,
        image_url=image_url,
        price=price,
        category=category,
        city=city,
        country=country,
        organizer=organizer,
        language=language,
        expiry_date=expiry_date,
    )

    db.session.add(event)
    db.session.commit()

    return jsonify(event.to_dict()), 201


# ---------- IMAGE UPLOAD & SERVE ----------

# POST /events/upload-image  (gateway -> /upload-image)
@bp.route("/upload-image", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    if not filename:
        return jsonify({"error": "Invalid filename"}), 400

    save_path = os.path.join(POSTERS_DIR, filename)
    file.save(save_path)

    url = f"/events/static/posters/{filename}"
    return jsonify({"url": url}), 201


# GET /events/static/posters/<filename>
@bp.route("/static/posters/<path:filename>", methods=["GET"])
def serve_poster(filename):
    return send_from_directory(POSTERS_DIR, filename)
