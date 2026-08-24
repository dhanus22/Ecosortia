import api from "./api";

export const getAdminDashboard = async () => {
    const response = await api.get("/waste/dashboard/");
    return response.data;
};

export const getAdminReports = async ({
    page = 1,
    search = "",
    status = "",
    waste_type = "",
    ordering = "created_at",
}) => {
    const response = await api.get("/waste/reports/", {
        params: { page, search, status, waste_type, ordering },
    });
    return response.data;
};

export const getAdminReportDetails = async (id) => {
    const response = await api.get(`/waste/reports/${id}/`);
    return response.data;
};