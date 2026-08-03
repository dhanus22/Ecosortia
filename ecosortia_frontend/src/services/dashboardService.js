import api from "./api";

export const getDashboard = async () => {
    const response = await api.get("/waste/my-dashboard/");
    return response.data;
};