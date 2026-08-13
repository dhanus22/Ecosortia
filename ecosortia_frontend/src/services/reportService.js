import api from "./api";

export const createReport = async (formData) => {
    const response = await api.post(
        "/waste/report/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getMyReports = async ({
    page = 1,
    search = "",
    status = "",
}) => {

    const response = await api.get("/waste/my-reports/", {

        params: {
            page,
            search,
            status,
        },});
    return response.data;
};

export const getReportDetails = async (id) => {
    const response = await api.get(`/waste/report/${id}/`);
    return response.data;
};