import api from "./api";


export const getCreditHistory = async () => {
    const response = await api.get("/credits/");
    return response.data;
};