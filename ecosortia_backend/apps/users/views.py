from rest_framework import generics, permissions, status
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .serializers import (
    UserRegisterSerializer,
    UserProfileSerializer,
    LoginSerializer,
    ChangePasswordSerializer
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

                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "credits": user.credits,

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