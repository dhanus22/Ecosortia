from django.contrib import admin
from .models import WasteReport


@admin.register(WasteReport)
class WasteReportAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "title",
        "user",
        "waste_type",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "waste_type",
    )

    search_fields = (
        "title",
        "address",
        "user__username",
    )

    ordering = (
        "created_at",
    )