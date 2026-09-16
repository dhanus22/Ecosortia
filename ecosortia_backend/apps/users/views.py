from rest_framework import generics, permissions, status
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from apps.users.permissions import IsMainAdmin
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.conf import settings
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.contrib.auth.models import Group

from .serializers import (
    MunicipalityUserCreateSerializer,
    UserRegisterSerializer,
    UserProfileSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    MunicipalityUserSerializer,
    MunicipalityUserRoleUpdateSerializer,
)

User = get_user_model()

@extend_schema(
    tags=["Authentication"],
    summary="Register User",
    description="""
Register a new citizen.

Returns the created user information.
""",
)

class RegisterUserView(generics.CreateAPIView):
    """
    Register a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

@extend_schema(
    tags=["Authentication"],
    summary="User Profile",
    description="""  
    Retrieve or update the authenticated user's profile.
""",
)
class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View and update the logged-in user's profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

@extend_schema(
    tags=["Authentication"],
    summary="User Login",
    description=""" Authenticate a user and return JWT Access and Refresh Tokens.""",
)
class LoginView(generics.GenericAPIView):

    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response({

            "message": "Login successful",

            "tokens": {

                "refresh": str(refresh),
                "access": str(refresh.access_token),

            },

            "user": {

                "user": {
                        "id": user.id,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "credits": user.credits,
                        "is_staff": user.is_staff,
                    }

            }

        }, status=status.HTTP_200_OK)

@extend_schema(
    tags=["Authentication"],
    summary="Change Password",
    description="Allows as authenticated user to change thrir password."
)
class ChangePasswordView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        request.user.set_password(
            serializer.validated_data["new_password"]
        )

        request.user.save()

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK
        )

@extend_schema(
    tags=["Authentication"],
    summary="Logout",
    description="Blacklist the refresh token and log the user out."
)
class LogoutView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        try:

            refresh_token = request.data["refresh"]

            token = RefreshToken(refresh_token)

            token.blacklist()

            return Response(
                {"message":"Logged out successfully."},
                status=status.HTTP_200_OK
            )

        except Exception:

            return Response(
                {"error":"Invalid refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(
            email__iexact=email,
            is_active=True,
        )

        for user in users:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_url = (
                f"{settings.FRONTEND_PASSWORD_RESET_URL}/"
                f"{uid}/{token}/"
            )

            send_mail(
                subject="EcoSortia Password Reset",
                message=(
                    "You requested a password reset for your EcoSortia account.\n\n"
                    f"Reset your password using this link:\n{reset_url}\n\n"
                    "This link is valid only for a limited time.\n"
                    "If you did not request this, you can ignore this email."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
            )

        return Response(
            {
                "message": (
                    "If an account exists with this email, "
                    "a password reset link has been sent."
                )
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if not password or not confirm_password:
            return Response(
                {"message": "Password and confirmation are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password != confirm_password:
            return Response(
                {"message": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"message": "Invalid password reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"message": "Invalid or expired password reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(password)
        user.save(update_fields=["password"])

        return Response(
            {"message": "Password has been reset successfully."},
            status=status.HTTP_200_OK,
        )

class MunicipalityUserCreateView(generics.CreateAPIView):
    serializer_class = MunicipalityUserCreateSerializer
    permission_classes = [IsMainAdmin]

class MunicipalityUserListView(generics.ListAPIView):
    serializer_class = MunicipalityUserSerializer
    permission_classes = [IsMainAdmin]

    def get_queryset(self):
        return User.objects.filter(
            is_staff=True,
            is_superuser=False,
            groups__name__in=[
                "Municipality Admin",
                "Municipality Staff",
            ],
        ).distinct().order_by("username")

class MunicipalityUserRoleUpdateView(generics.UpdateAPIView):
    serializer_class = MunicipalityUserRoleUpdateSerializer
    permission_classes = [IsMainAdmin]
    queryset = User.objects.filter(
        is_staff=True,
        is_superuser=False,
    )

    def perform_update(self, serializer):
        user = self.get_object()
        role = serializer.validated_data["role"]

        user.groups.clear()
        user.groups.add(
            Group.objects.get(name=role)
        )

        user.is_staff = True
        user.save(update_fields=["is_staff"])