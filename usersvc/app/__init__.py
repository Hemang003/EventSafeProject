import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Database config (Docker injects DATABASE_URL env)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://user_service_user:user_service_pass@db:5432/user_service_db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # JWT secret key (for signing tokens)
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "super-secret-change-this"
    )

    # init extensions
    db.init_app(app)
    jwt.init_app(app)

    # import models so SQLAlchemy knows them
    from app import models  # noqa: F401

    # register routes blueprint
    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)

    # create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app
