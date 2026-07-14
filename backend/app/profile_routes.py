import os
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from marshmallow import ValidationError

from app.account_routes import login_required
from app.extensions import db
from app.models import Profile
from app.schemas import ProfileSchema

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")

profile_schema = ProfileSchema()

ALLOWED_CV_EXTENSIONS = {".pdf", ".doc", ".docx"}
ALLOWED_CV_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def is_allowed_cv(file):
    filename = secure_filename(file.filename or "")
    extension = Path(filename).suffix.lower()

    return extension in ALLOWED_CV_EXTENSIONS and file.mimetype in ALLOWED_CV_MIME_TYPES

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

@profile_bp.post("/cv")
@login_required
def upload_cv(user):
    if not user.profile:
        return jsonify({"error": "Create your profile before uploading a CV."}), 400

    cv_file = request.files.get("cv")

    if not cv_file or not cv_file.filename:
        return jsonify({"error": "CV file is required."}), 400

    if not is_allowed_cv(cv_file):
        return jsonify({"error": "Only PDF, DOC, and DOCX files are allowed."}), 400

    original_filename = secure_filename(cv_file.filename)
    extension = Path(original_filename).suffix.lower()
    stored_filename = f"{user.id}-{uuid4().hex}{extension}"

    upload_folder = current_app.config["CV_UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, stored_filename)
    cv_file.save(file_path)

    user.profile.cv_original_filename = original_filename
    user.profile.cv_stored_filename = stored_filename
    user.profile.cv_content_type = cv_file.mimetype
    user.profile.cv_file_size = os.path.getsize(file_path)
    user.profile.cv_uploaded_at = datetime.now(timezone.utc)
    user.profile.verification_status = "not_submitted"

    db.session.commit()

    return jsonify({"profile": user.profile.to_dict()}), 200