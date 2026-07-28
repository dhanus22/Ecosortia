from rest_framework.permissions import BasePermission

class IsMunicipalityAdmin(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_staff