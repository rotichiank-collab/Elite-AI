from marshmallow import Schema, ValidationError, fields, validate, validates_schema


class RegisterSchema(Schema):
    name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=120),
    )
    email = fields.Email(required=True)
    password = fields.String(
        required=True,
        load_only=True,
        validate=validate.Length(min=8, max=128),
    )
    confirm_password = fields.String(required=True, load_only=True)

    @validates_schema
    def validate_passwords_match(self, data, **kwargs):
        if data["password"] != data["confirm_password"]:
            raise ValidationError(
                {"confirm_password": ["Passwords must match."]}
            )


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)

class ChangePasswordSchema(Schema):
    current_password = fields.String(required=True, load_only=True)
    new_password = fields.String(
        required=True,
        load_only=True,
        validate=validate.Length(min=8, max=128),
    )
    confirm_new_password = fields.String(required=True, load_only=True)

    @validates_schema
    def validate_new_passwords_match(self, data, **kwargs):
        if data["new_password"] != data["confirm_new_password"]:
            raise ValidationError(
                {"confirm_new_password": ["New passwords must match."]}
            )
        
class ProfileSchema(Schema):
    full_name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=120),
    )
    home_address = fields.String(
        required=False,
        allow_none=True,
        load_default=None,
        validate=validate.Length(max=255),
    )
    country = fields.String(
        required=False,
        allow_none=True,
        load_default=None,
        validate=validate.Length(max=100),
    )
    phone_number = fields.String(
        required=False,
        allow_none=True,
        load_default=None,
        validate=validate.Length(max=40),
    )
    email = fields.Email(required=True)
    linkedin_url = fields.Url(
        required=False,
        allow_none=True,
        load_default=None,
        validate=validate.Length(max=255),
    )