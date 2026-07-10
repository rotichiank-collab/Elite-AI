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