from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.
@admin.register(User)
class customUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        (
            "Additional Information",
            {
                "fields": (
                    "phone_number",
                    "address",
                    "profile_picture",
                    "credits",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    readonly_fields = (
        "credits",
        "created_at",
        "updated_at",
    )