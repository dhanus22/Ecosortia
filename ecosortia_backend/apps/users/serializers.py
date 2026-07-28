from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
import re

User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "address",
            "password",
            "confirm_password",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )
        return attrs

    def validate_username(self, value):

        if len(value) < 4:
            raise serializers.ValidationError(
                "Username must contain at least 4 characters."
            )

        return value

    
    def validate_phone_number(self, value):

        if not re.fullmatch(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError(
                "Enter a valid 10-digit Indian mobile number."
            )

        return value

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            address=validated_data["address"],
            password=validated_data["password"],
        )

        return user


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "address",
            "profile_picture",
            "credits",
            "created_at",
        ]

        read_only_fields = [
            "credits",
            "created_at",
        ]


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()

    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):

        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(
            username=username,
            password=password
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid username or password."
            )

        attrs["user"] = user

        return attrs

def update(self, instance, validated_data):

    instance.first_name = validated_data.get(
        "first_name",
        instance.first_name
    )

    instance.last_name = validated_data.get(
        "last_name",
        instance.last_name
    )

    instance.email = validated_data.get(
        "email",
        instance.email
    )

    instance.phone_number = validated_data.get(
        "phone_number",
        instance.phone_number
    )

    instance.address = validated_data.get(
        "address",
        instance.address
    )

    if "profile_picture" in validated_data:
        instance.profile_picture = validated_data["profile_picture"]

    instance.save()

    return instance

from django.contrib.auth.password_validation import validate_password

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError({
                "old_password": "Old password is incorrect."
            })

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        validate_password(attrs["new_password"], user)

        return attrs