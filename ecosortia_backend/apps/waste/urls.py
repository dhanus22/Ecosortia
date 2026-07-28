from django.urls import path
from .views import (
    WasteReportCreateView,
    MyWasteReportsView,
    WasteReportDetailView,
    UpdateWasteStatusView,
    AllWasteReportsView,
    DashboardStatsView,
    MyDashboardView,
)

urlpatterns = [
    path("report/",WasteReportCreateView.as_view(),
        name="create-report",
    ),
    path(
        "my-reports/",
        MyWasteReportsView.as_view(),
        name="my-reports",
    ),
    path(
        "report/<int:pk>/",
        WasteReportDetailView.as_view(),
        name="report-detail",
    ),
    path(
        "report/<int:pk>/status", UpdateWasteStatusView.as_view(),
        name= "update-status",
    ),
    path("reports/", AllWasteReportsView.as_view(),
         name= "all-reports"),
    path(
    "dashboard/",
    DashboardStatsView.as_view(),
    name="dashboard",),
    path(
    "my-dashboard/",
    MyDashboardView.as_view(),
    name="my-dashboard",
),
]