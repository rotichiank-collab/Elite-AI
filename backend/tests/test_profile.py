import pytest

from app import create_app
from app.extensions import db


@pytest.fixture()
def app():
    app = create_app()
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
    )

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def register_user(client):
    return client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "strongpassword123",
            "confirm_password": "strongpassword123",
        },
    )


def valid_profile_payload():
    return {
        "full_name": "Test User",
        "home_address": "123 Test Street",
        "country": "Kenya",
        "phone_number": "+254700000000",
        "email": "test@example.com",
        "linkedin_url": "https://www.linkedin.com/in/test-user",
    }


def test_get_profile_requires_login(client):
    response = client.get("/api/profile")

    assert response.status_code == 401


def test_get_profile_returns_none_when_missing(client):
    register_user(client)

    response = client.get("/api/profile")

    assert response.status_code == 200
    assert response.get_json()["profile"] is None


def test_create_profile(client):
    register_user(client)

    response = client.post("/api/profile", json=valid_profile_payload())

    assert response.status_code == 201
    assert response.get_json()["profile"]["country"] == "Kenya"


def test_create_profile_rejects_duplicate(client):
    register_user(client)
    client.post("/api/profile", json=valid_profile_payload())

    response = client.post("/api/profile", json=valid_profile_payload())

    assert response.status_code == 409


def test_update_profile(client):
    register_user(client)
    client.post("/api/profile", json=valid_profile_payload())

    payload = valid_profile_payload()
    payload["country"] = "Uganda"

    response = client.patch("/api/profile", json=payload)

    assert response.status_code == 200
    assert response.get_json()["profile"]["country"] == "Uganda"


def test_delete_profile(client):
    register_user(client)
    client.post("/api/profile", json=valid_profile_payload())

    response = client.delete("/api/profile")

    assert response.status_code == 200

    get_response = client.get("/api/profile")
    assert get_response.get_json()["profile"] is None