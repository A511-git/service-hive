import React, { createContext, useContext, useMemo, useState } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("accessToken") || null);
    const [user, setUser] = useState(null);

    const login = ({ token, user }) => {
        setToken(token);
        setUser(user || null);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            token,
            user,
            isLoggedIn: !!token,

            login,
            logout,
            setToken,
            setUser,
        }),
        [token, user]
    );

    authService.init(value);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
