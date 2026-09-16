import api from "./api";

export const login = async (credentials) => {
    const response = await api.post("/users/login/", credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post("/users/register/", userData);
    return response.data;
};

export const requestPasswordReset = async (email) => {
    const response = await api.post("/users/password-reset/", { email });
    return response.data;
};

export const resetPassword = async (uidb64, token, data) => {
    const response = await api.post(
        `/users/password-reset-confirm/${uidb64}/${token}/`,
        data
    );
    return response.data;
};