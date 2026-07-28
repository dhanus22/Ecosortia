from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class WasteReport(models.Model):

    class WasteType(models.TextChoices):
        PLASTIC = "Plastic", "Plastic"
        ORGANIC = "Organic", "Organic"
        PAPER = "Paper", "Paper"
        GLASS = "Glass", "Glass"
        METAL = "Metal", "Metal"
        ELECTRONIC = "Electronic", "Electronic"
        CONSTRUCTION = "Construction", "Construction"
        MEDICAL = "Medical", "Medical"
        MIXED = "Mixed", "Mixed"
        OTHER = "Other", "Other"

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        IN_PROGRESS = "In Progress", "In Progress"
        COMPLETED = "Completed", "Completed"
        REJECTED = "Rejected", "Rejected"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="waste_reports"
    )

    title = models.CharField(max_length=150)

    description = models.TextField()

    waste_type = models.CharField(
        max_length=20,
        choices=WasteType.choices
    )

    image = models.ImageField(
        upload_to="waste/"
    )

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    address = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    credits_awarded = models.PositiveIntegerField(
        default=0
    )

    admin_remarks = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True
    )

    class Meta:

        ordering = ["-created_at"]

        indexes = [

            models.Index(fields=["status"]),

            models.Index(fields=["waste_type"]),

            models.Index(fields=["created_at"]),

            models.Index(fields=["user"]),

        ]

    def __str__(self):
        return f"{self.title} ({self.status})"