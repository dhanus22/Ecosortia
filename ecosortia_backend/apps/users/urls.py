from django.urls import path
from .views import RegisterUserView, UserProfileView, LoginView, ChangePasswordView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("login/", LoginView.as_view(), name="login"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password" ),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]