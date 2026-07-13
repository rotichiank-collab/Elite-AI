from functools import wraps

from flask import Blueprint, jsonify, request, session
from marshmallow import ValidationError

from app.extensions import db
from app.models import User
from app.schemas import ChangePasswordSchema

account_bp = Blueprint("account", __name__, url_prefix="/api/account")

change_password_schema = ChangePasswordSchema()


def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        user_id = session.get("user_id")

        if not user_id:
            return jsonify({"error": "Authentication required."}), 401

        user = db.session.get(User, user_id)

        if not user:
            session.clear()
            return jsonify({"error": "Authentication required."}), 401

        return view(user, *args, **kwargs)

    return wrapped_view


@account_bp.patch("/password")
@login_required
def change_password(user):
    try:
        data = change_password_schema.load(request.get_json() or {})
    except ValidationError as error:
        return jsonify({"errors": error.messages}), 400

    if not user.check_password(data["current_password"]):
        return jsonify({"error": "Current password is incorrect."}), 401

    user.set_password(data["new_password"])
    db.session.commit()

    return jsonify({"message": "Password changed successfully."}), 200


@account_bp.delete("")
@login_required
def delete_account(user):
    db.session.delete(user)
    db.session.commit()
    session.clear()

    return jsonify({"message": "Account deleted successfully."}), 200