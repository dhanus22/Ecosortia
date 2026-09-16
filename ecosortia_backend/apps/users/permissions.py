from rest_framework.permissions import BasePermission

class IsMainAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_superuser
        )

class IsMunicipalityUser(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.is_staff
            and not user.is_superuser
            and user.groups.filter(
                name__in=["Municipality Admin", "Municipality Staff"]
            ).exists()
        )