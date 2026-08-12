from rest_framework import generics, permissions
from .models import WasteReport
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Sum
from rest_framework.views import APIView
from .serializers import (
    WasteReportCreateSerializer,
    WasteReportSerializer,
    WasteReportStatusSerializer,
)
from apps.credits.services import add_credits, calculate_credits
from apps.common.permissions import IsMunicipalityAdmin
from drf_spectacular.utils import extend_schema


@extend_schema(
    tags=["Waste Reports"],
    summary="Create Waste Report",
    description=""" 
Create a new report.
Requires image, location and waste information.
"""
)
class WasteReportCreateView(generics.CreateAPIView):

    serializer_class = WasteReportCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


@extend_schema(
    tags=["Waste Reports"],
    summary="My reports",
    description="Returns all reports submittted by the authenticated user."
)
class MyWasteReportsView(generics.ListAPIView):
    serializer_class = WasteReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = ["status", "waste_type"]

    search_fields = [
        "title",
        "description",
        "address",
        "waste_type",
    ]

    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return WasteReport.objects.filter(
            user=self.request.user
        )

@extend_schema(
    tags=["Waste Reports"],
    summary="reports Details",
    description="Returns a single report belonging to the authenticated user."
)
class WasteReportDetailView(generics.RetrieveAPIView):

    serializer_class = WasteReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WasteReport.objects.filter(
            user=self.request.user
        )

@extend_schema(
    tags=["Municipality"],
    summary="All Waste Reports",
    description="Reports every waste report in the system."
)
class AllWasteReportsView(generics.ListAPIView):
    serializer_class = WasteReportSerializer
    permission_classes = [IsMunicipalityAdmin]

    queryset = WasteReport.objects.select_related("user").all()

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]

    filterset_fields = [
        "status",
        "waste_type",
    ]

    search_fields = [
        "title",
        "description",
        "address",
        "user_username"
    ]

    OrderingFilter = [
        "created-at",
        "completed_at",
        "credits_awarded",
    ]

    ordering = [
        "-created_at"
    ]

@extend_schema(
    tags=["Municipality"],
    summary="Update Report Status",
    description="""  

"""
)
class UpdateWasteStatusView(generics.UpdateAPIView):
    serializer_class = WasteReportStatusSerializer
    permission_classes = [IsMunicipalityAdmin]

    queryset = WasteReport.objects.all()

    def perform_update(self, serializer):

        report = self.get_object()
        old_status = report.status
        new_status = serializer.validated_data["status"]

        serializer.save()

        if(
            old_status != WasteReport.Status.COMPLETED
            and new_status == WasteReport.Status.COMPLETED
        ):
            report.completed_at = timezone.now()

            if report.credits_awarded == 0:
                points = calculate_credits(report.waste_type)
                report.credits_awarded = points

                add_credits(
                    report.user,
                    points,
                    "Waste report completed"
                )

            report.save(update_fields=["completed_at", "credits_awarded"])


@extend_schema(
    tags=["Dashboard"],
    summary="Municipality Dashboard",
    description="Reports statistics required for the municipality dashboard."
)
class DashboardStatsView(APIView):

    permission_classes = [IsMunicipalityAdmin]

    def get(self, request):

        reports = WasteReport.objects.all()

        data = {

            "total_reports" : reports.count(),
            "pending" : reports.filter(
                status=WasteReport.Status.PENDING
            ).count(),

            "in_progress": reports.filter(
                status=WasteReport.Status.IN_PROGRESS
            ).count(),

            "completed" : reports.filter(
                status=WasteReport.Status.COMPLETED
            ).count(),

            "rejected" : reports.filter(
                status=WasteReport.Status.COMPLETED
            ).count(),

            "credits_issued" :
                reports.aggregate(
                    Sum("credits_awarded")
            )["credits_awarded__sum"] or 0, 

        }

        return Response(data)

@extend_schema(
    tags=["Dashboard"],
    summary="Citizen Dashboard",
    description="Returns dashboard statistics for the logged-in citizen."
)
class MyDashboardView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        reports = WasteReport.objects.filter(user=request.user)

        data = {
            "credits": request.user.credits,

            "total_reports": reports.count(),

            "pending": reports.filter(
                status=WasteReport.Status.PENDING
            ).count(),

            "in_progress": reports.filter(
                status=WasteReport.Status.IN_PROGRESS
            ).count(),

            "completed": reports.filter(
                status=WasteReport.Status.COMPLETED
            ).count(),

            "rejected": reports.filter(
                status=WasteReport.Status.REJECTED
            ).count(),
        }

        return Response(data)