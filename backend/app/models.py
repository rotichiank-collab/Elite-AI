from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), nullable=False, default="user")
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
        }
    
class Profile(db.Model):
    __tablename__ = "profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    full_name = db.Column(db.String(120), nullable=False)
    home_address = db.Column(db.String(255), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    phone_number = db.Column(db.String(40), nullable=True)
    email = db.Column(db.String(255), nullable=False)
    linkedin_url = db.Column(db.String(255), nullable=True)
    verification_status = db.Column(
        db.String(40),
        nullable=False,
        default="not_submitted",
    )
    cv_original_filename = db.Column(db.String(255), nullable=True)
    cv_stored_filename = db.Column(db.String(255), nullable=True)
    cv_content_type = db.Column(db.String(120), nullable=True)
    cv_file_size = db.Column(db.Integer, nullable=True)
    cv_uploaded_at = db.Column(db.DateTime, nullable=True)
      
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = db.relationship(
        "User",
        backref=db.backref(
            "profile",
            uselist=False,
            cascade="all, delete-orphan",
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "full_name": self.full_name,
            "home_address": self.home_address,
            "country": self.country,
            "phone_number": self.phone_number,
            "email": self.email,
            "linkedin_url": self.linkedin_url,
            "verification_status": self.verification_status,
            "cv_original_filename": self.cv_original_filename,
            "cv_stored_filename": self.cv_stored_filename,
            "cv_content_type": self.cv_content_type,
            "cv_file_size": self.cv_file_size,
            "cv_uploaded_at": self.cv_uploaded_at.isoformat() if self.cv_uploaded_at else None,
        }