import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

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

    return app