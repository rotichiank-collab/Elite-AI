import pytest

from app import create_app
from app.extensions import db


@pytest.fixture()
def app():
    app = create_app()
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
        WTF_CSRF_ENABLED=False,
    )

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def test_register_creates_user_and_logs_them_in(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "strongpassword123",
            "confirm_password": "strongpassword123",
        },
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["user"]["email"] == "test@example.com"
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]

    me_response = client.get("/api/auth/me")
    assert me_response.get_json()["user"]["email"] == "test@example.com"


def test_register_rejects_password_mismatch(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "strongpassword123",
            "confirm_password": "differentpassword123",
        },
    )

    assert response.status_code == 400


def test_login_rejects_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "strongpassword123",
            "confirm_password": "strongpassword123",
        },
    )

    client.post("/api/auth/logout")

    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword123",
        },
    )

    assert response.status_code == 401


def test_logout_clears_session(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "strongpassword123",
            "confirm_password": "strongpassword123",
        },
    )

    logout_response = client.post("/api/auth/logout")
    assert logout_response.status_code == 200

    me_response = client.get("/api/auth/me")
    assert me_response.get_json()["user"] is None