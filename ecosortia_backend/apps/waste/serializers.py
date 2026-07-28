from rest_framework import serializers
from .models import WasteReport
import os
from datetime import timedelta
from django.utils import timezone

class WasteReportCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = WasteReport
        fields = (
            "title",
            "description",
            "waste_type",
            "image",
            "latitude",
            "longitude",
            "address",
        )

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return WasteReport.objects.create(**validated_data)

    def validate_title(self, value):

        value = value.strip()

        if len(value) < 5:
            raise serializers.ValidationError(
                "Title must contain at least 5 characters."
            )

        return value

    def validate_description(self, value):

        value = value.strip()

        if len(value) < 15:
            raise serializers.ValidationError(
                "Description should contain at least 15 characters."
            )

        return value

    def validate_latitude(self, value):

        if value < -90 or value > 90:
            raise serializers.ValidationError(
                "Latitude must be between -90 and 90."
            )

        return value

    def validate_longitude(self, value):

        if value < -180 or value > 180:
            raise serializers.ValidationError(
                "Longitude must be between -180 and 180."
            )

        return value

    def validate_image(self, image):

        if image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                "Image size cannot exceed 5 MB."
            )

        return image
    

    def validate_image(self, image):

        ext = os.path.splitext(image.name)[1].lower()

        allowed = [
            ".jpg",
            ".jpeg",
            ".png",
        ]

        if ext not in allowed:
            raise serializers.ValidationError(
                "Only JPG and PNG images are allowed."
            )

        if image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                "Image size cannot exceed 5 MB."
            )

        return image

    def validate(self, attrs):

        user = self.context["request"].user

        duplicate = WasteReport.objects.filter(
            user=user,
            address=attrs["address"],
            status=WasteReport.Status.PENDING,
            created_at__gte=timezone.now() - timedelta(hours=24),
        ).exists()

        if duplicate:
            raise serializers.ValidationError(
                "A similar report already exists for this location."
            )

        return attrs

    def validate(self, attrs):

        if self.instance:

            if self.instance.status == WasteReport.Status.COMPLETED:

                raise serializers.ValidationError(
                    "Completed reports cannot be modified."
                )

        return attrs

class WasteReportSerializer(serializers.ModelSerializer):

    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = WasteReport
        fields = (
            "id",
            "user",
            "title",
            "description",
            "waste_type",
            "image",
            "latitude",
            "longitude",
            "address",
            "status",
            "credits_awarded",
            "admin_remarks",
            "created_at",
            "updated_at",
            "completed_at",
        )


from rest_framework import serializers
from .models import WasteReport


class WasteReportStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = WasteReport
        fields = (
            "status",
            "admin_remarks",
        )

    def validate(self, attrs):

        report = self.instance

        current_status = report.status
        new_status = attrs["status"]

        if (
            new_status == WasteReport.Status.REJECTED
            and not attrs.get("admin_remarks")
        ):
            raise serializers.ValidationError(
                {
                    "admin_remarks":
                    "Remarks are required when rejecting a report."
                }
                )

        if (
            new_status == WasteReport.Status.COMPLETED
            and not attrs.get("admin_remarks")
            ):
            raise serializers.ValidationError(
                {
                    "admin_remarks":
                    "Completion remarks are required."
                }
            )

        valid_transitions = {

            WasteReport.Status.PENDING: [
                WasteReport.Status.IN_PROGRESS,
                WasteReport.Status.REJECTED,
            ],

            WasteReport.Status.IN_PROGRESS: [
                WasteReport.Status.COMPLETED,
            ],

            WasteReport.Status.COMPLETED: [],

            WasteReport.Status.REJECTED: [],
        }

        if new_status not in valid_transitions[current_status]:

            raise serializers.ValidationError(
                {
                    "status":
                    f"Cannot change status from '{current_status}' to '{new_status}'."
                }
            )

        return attrs
        