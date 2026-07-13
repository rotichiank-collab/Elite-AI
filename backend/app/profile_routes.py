from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from app.account_routes import login_required
from app.extensions import db
from app.models import Profile
from app.schemas import ProfileSchema

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")

profile_schema = ProfileSchema()


@profile_bp.get("")
@login_required
def get_profile(user):
    if not user.profile:
        return jsonify({"profile": None}), 200

    return jsonify({"profile": user.profile.to_dict()}), 200


@profile_bp.post("")
@login_required
def create_profile(user):
    if user.profile:
        return jsonify({"error": "Profile already exists."}), 409

    try:
        data = profile_schema.load(request.get_json() or {})
    except ValidationError as error:
        return jsonify({"errors": error.messages}), 400

    profile = Profile(
        user_id=user.id,
        full_name=data["full_name"].strip(),
        home_address=(data.get("home_address") or "").strip() or None,
        country=(data.get("country") or "").strip() or None,
        phone_number=(data.get("phone_number") or "").strip() or None,
        email=data["email"].strip().lower(),
        linkedin_url=(data.get("linkedin_url") or "").strip() or None,
    )

    db.session.add(profile)
    db.session.commit()

    return jsonify({"profile": profile.to_dict()}), 201


@profile_bp.patch("")
@login_required
def update_profile(user):
    if not user.profile:
        return jsonify({"error": "Profile does not exist."}), 404

    try:
        data = profile_schema.load(request.get_json() or {})
    except ValidationError as error:
        return jsonify({"errors": error.messages}), 400

    user.profile.full_name = data["full_name"].strip()
    user.profile.home_address = (data.get("home_address") or "").strip() or None
    user.profile.country = (data.get("country") or "").strip() or None
    user.profile.phone_number = (data.get("phone_number") or "").strip() or None
    user.profile.email = data["email"].strip().lower()
    user.profile.linkedin_url = (data.get("linkedin_url") or "").strip() or None

    db.session.commit()

    return jsonify({"profile": user.profile.to_dict()}), 200


@profile_bp.delete("")
@login_required
def delete_profile(user):
    if not user.profile:
        return jsonify({"profile": None}), 200

    db.session.delete(user.profile)
    db.session.commit()

    return jsonify({"message": "Profile deleted successfully."}), 200