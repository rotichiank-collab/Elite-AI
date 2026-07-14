import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from app.profile_routes import profile_bp
from app.account_routes import account_bp
from app.auth_routes import auth_bp
from app.extensions import db, migrate
from app.routes import main_bp


def create_app():
    load_dotenv()

    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-only-change-me")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "sqlite:///elite_ai_dev.sqlite3",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    max_cv_upload_mb = int(os.getenv("MAX_CV_UPLOAD_MB", "5"))
    
    app.config["MAX_CONTENT_LENGTH"] = max_cv_upload_mb * 1024 * 1024
    app.config["CV_UPLOAD_FOLDER"] = os.getenv(
        "CV_UPLOAD_FOLDER",
        os.path.join(app.instance_path, "uploads", "cvs"),
    )

    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

    frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

    CORS(
        app,
        resources={r"/api/*": {"origins": frontend_origin}},
        supports_credentials=True,
    )

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(account_bp)
    app.register_blueprint(profile_bp)

    return app