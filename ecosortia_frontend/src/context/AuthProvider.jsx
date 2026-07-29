import {  useState } from "react";

import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.warn("Failed to parse stored user from localStorage:", error);
            return null;
        }
    });

    const login = (data) => {
        const accessToken = data.access ?? data.tokens?.access;
        const refreshToken = data.refresh ?? data.tokens?.refresh;


        if (!accessToken || !refreshToken) {
            console.warn("Login response missing access or refresh token:", data);
            return;
        }

        localStorage.setItem("access", accessToken);
        localStorage.setItem("refresh", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        //console.log("stored access:", localStorage.getItem("access"));

        setUser(user);
    };

    const logout = () => {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        setUser(null);
    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );
}

