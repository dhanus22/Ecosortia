import api from "./api.js";

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
