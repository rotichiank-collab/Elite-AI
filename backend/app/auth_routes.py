from flask import Blueprint, jsonify, request, session
from marshmallow import ValidationError
from sqlalchemy import func

from app.extensions import db
from app.models import User
from app.schemas import LoginSchema, RegisterSchema

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

register_schema = RegisterSchema()
login_schema = LoginSchema()


@auth_bp.post("/register")
def register():
    try:
        data = register_schema.load(request.get_json() or {})
    except ValidationError as error:
        return jsonify({"errors": error.messages}), 400

    email = data["email"].strip().lower()
    existing_user = User.query.filter(func.lower(User.email) == email).first()

    if existing_user:
        return jsonify({"error": "An account with this email already exists."}), 409

    user = User(
        name=data["name"].strip(),
        email=email,
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    session.clear()
    session["user_id"] = user.id

    return jsonify({"user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
    try:
        data = login_schema.load(request.get_json() or {})
    except ValidationError as error:
        return jsonify({"errors": error.messages}), 400

    email = data["email"].strip().lower()
    user = User.query.filter(func.lower(User.email) == email).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid email or password."}), 401

    session.clear()
    session["user_id"] = user.id

    return jsonify({"user": user.to_dict()}), 200


@auth_bp.post("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully."}), 200


@auth_bp.get("/me")
def me():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"user": None}), 200

    user = db.session.get(User, user_id)

    if not user:
        session.clear()
        return jsonify({"user": None}), 200

    return jsonify({"user": user.to_dict()}), 200