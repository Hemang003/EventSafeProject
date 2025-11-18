# eventsvc/app/__init__.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# single global db instance for this service
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # DB connection for event service
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "EVENTS_DATABASE_URL",
        "postgresql+psycopg2://event_service_user:event_service_pass@events_db:5432/event_service_db",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # attach db to app
    db.init_app(app)

    # import models so SQLAlchemy knows tables
    from app import models  # noqa: F401

    # register routes
    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)

    # create tables
    with app.app_context():
        db.create_all()

    return app
