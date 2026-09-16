from django.urls import path
from .views import RegisterUserView, UserProfileView, LoginView, ChangePasswordView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    PasswordResetRequestView,
    PasswordResetConfirmView,
    MunicipalityUserCreateView,
    MunicipalityUserListView,
    MunicipalityUserRoleUpdateView
)

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("login/", LoginView.as_view(), name="login"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password" ),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path( "password-reset/",PasswordResetRequestView.as_view(),name="password-reset", ),
    path("password-reset-confirm/<uidb64>/<token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm",),
    path("municipality/users/",MunicipalityUserListView.as_view(),name="municipality-users",),
    path("municipality/users/create/",MunicipalityUserCreateView.as_view(),name="create-municipality-user",),
    path("municipality/users/<int:pk>/role/",MunicipalityUserRoleUpdateView.as_view(),name="update-municipality-user-role",),
]


