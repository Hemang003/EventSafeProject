import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import redis

db = SQLAlchemy()
jwt = JWTManager()
r = None  # Redis client

def create_app():
    app = Flask(__name__)

    # Postgres for confirmed bookings
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "BOOKINGS_DATABASE_URL",
        "postgresql+psycopg2://booking_service_user:booking_service_pass@db:5432/booking_service_db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # JWT (must match usersvc secret)
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-this-secret-later")

    db.init_app(app)
    jwt.init_app(app)

    # Redis for seat locks
    redis_host = os.getenv("REDIS_HOST", "redis")
    redis_port = int(os.getenv("REDIS_PORT", "6379"))
    global r
    r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

    from app import models  # noqa

    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)

    with app.app_context():
        db.create_all()

    return app
