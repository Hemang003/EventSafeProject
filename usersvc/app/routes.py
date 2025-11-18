from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

from app import db
from app.models import User
from app.auth import hash_password, verify_password

bp = Blueprint("main", __name__)

# Health check for service / docker
@bp.get("/health")
def health():
    return jsonify(status="ok", service="usersvc")

# ---------------------------
# SIGNUP
# ---------------------------
@bp.post("/api/signup")
def signup():
    data = request.get_json(force=True)

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify(error="name, email, password are required"), 400

    # check duplicate email
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify(error="email already registered"), 409

    # hash password
    pw_hash = hash_password(password)

    # create user
    user = User(name=name, email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()

    return jsonify(
        message="user created",
        user=user.to_dict()
    ), 201


# ---------------------------
# LOGIN
# ---------------------------
@bp.post("/api/login")
def login():
    data = request.get_json(force=True)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify(error="email and password are required"), 400

    # find user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(error="invalid email or password"), 401

    # verify password
    if not verify_password(user.password_hash, password):
        return jsonify(error="invalid email or password"), 401

    # create JWT token
    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(hours=12)
    )

    return jsonify(
        message="login successful",
        access_token=access_token,
        user=user.to_dict()
    ), 200


# ---------------------------
# PROTECTED ROUTE EXAMPLE
# ---------------------------
@bp.get("/api/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify(error="user not found"), 404

    return jsonify(user=user.to_dict()), 200
