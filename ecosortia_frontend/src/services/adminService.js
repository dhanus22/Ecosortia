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

export const updateReportStatus = async (id, data) => {
    const response = await api.put(`/waste/report/${id}/status/`, data);
    return response.data;
};

export const downloadAdminReportPDF = async (id) => {
    const response = await api.get(`/waste/reports/${id}/pdf/`, {
        responseType: "blob",
    });
    return response.data;
};

export const exportAdminReportsExcel = async (params = {}) => {
    const response = await api.get("/waste/reports/export/excel/", {
        params,
        responseType: "blob",
    });
    return response.data;
};

export const getMunicipalityUsers = async () => {
    const response = await api.get("/users/municipality/users/");
    return response.data;
};

export const createMunicipalityUser = async (data) => {
    const response = await api.post("/users/municipality/users/create/", data);
    return response.data;
};

export const updateMunicipalityUserRole = async (id, role) => {
    const response = await api.put(`/users/municipality/users/${id}/role/`, { role });
    return response.data;
};