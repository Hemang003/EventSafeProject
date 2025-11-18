# eventsvc/app/models.py
from app import db


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)

    # basic fields
    title = db.Column(db.String(200), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    venue = db.Column(db.String(255), nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)

    # extra fields
    description = db.Column(db.Text)          # long description
    image_url = db.Column(db.String(500))     # poster URL
    price = db.Column(db.Numeric(10, 2))      # ticket price
    category = db.Column(db.String(100))      # Concert, Sports...
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    organizer = db.Column(db.String(150))
    language = db.Column(db.String(60))
    expiry_date = db.Column(db.DateTime)      # when booking closes

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "date": self.date.isoformat() if self.date else None,
            "venue": self.venue,
            "total_seats": self.total_seats,
            "available_seats": self.available_seats,
            "description": self.description,
            "image_url": self.image_url,
            "price": float(self.price) if self.price is not None else None,
            "category": self.category,
            "city": self.city,
            "country": self.country,
            "organizer": self.organizer,
            "language": self.language,
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
        }
