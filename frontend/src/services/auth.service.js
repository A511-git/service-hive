import api from "../api/axios";

export const authService = {
    _auth: null,

    init(authContext) {
        this._auth = authContext;
    },

    async register(payload) {
        const res = await api.post("/api/auth/register", payload);
        return res.data;
    },

    async login(payload) {
        const res = await api.post("/api/auth/login", payload);
        const user = res?.data?.data;
        const token = localStorage.getItem("accessToken");
        if (this._auth && token) {
            this._auth.login({ token, user });
        }
        return res.data;
    },

    async refresh() {
        const res = await api.get("/api/auth/refresh");
        const token = localStorage.getItem("accessToken");
        if (this._auth && token) {
            this._auth.setToken(token);
        }
        return res.data;
    },

    async me() {
        const res = await api.get("/api/auth/me");
        const user = res?.data?.data;
        if (this._auth && user) {
            this._auth.setUser(user);
        }
        return res.data;
    },

    logout() {
        localStorage.removeItem("accessToken");
        if (this._auth) this._auth.logout();
    },
};
