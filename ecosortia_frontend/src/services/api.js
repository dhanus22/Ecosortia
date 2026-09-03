import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type" : "application/json"
    }
});
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("access");
    const isAuthRoute = config.url?.includes("/users/login/") || config.url?.includes("/users/register/");

    if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;