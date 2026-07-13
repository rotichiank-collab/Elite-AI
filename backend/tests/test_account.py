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


def test_change_password_requires_login(client):
    response = client.patch(
        "/api/account/password",
        json={
            "current_password": "strongpassword123",
            "new_password": "newstrongpassword123",
            "confirm_new_password": "newstrongpassword123",
        },
    )

    assert response.status_code == 401


def test_change_password_updates_password(client):
    register_user(client)

    response = client.patch(
        "/api/account/password",
        json={
            "current_password": "strongpassword123",
            "new_password": "newstrongpassword123",
            "confirm_new_password": "newstrongpassword123",
        },
    )

    assert response.status_code == 200

    client.post("/api/auth/logout")

    old_login = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "strongpassword123",
        },
    )
    assert old_login.status_code == 401

    new_login = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "newstrongpassword123",
        },
    )
    assert new_login.status_code == 200


def test_change_password_rejects_wrong_current_password(client):
    register_user(client)

    response = client.patch(
        "/api/account/password",
        json={
            "current_password": "wrongpassword123",
            "new_password": "newstrongpassword123",
            "confirm_new_password": "newstrongpassword123",
        },
    )

    assert response.status_code == 401


def test_delete_account_requires_login(client):
    response = client.delete("/api/account")

    assert response.status_code == 401


def test_delete_account_removes_user(client):
    register_user(client)

    response = client.delete("/api/account")
    assert response.status_code == 200

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "strongpassword123",
        },
    )

    assert login_response.status_code == 401