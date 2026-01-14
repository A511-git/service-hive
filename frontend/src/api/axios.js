import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8001",
    withCredentials: true,
    timeout: 20000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => {
        const auth = res.headers?.authorization;
        if (auth?.startsWith("Bearer ")) {
            const token = auth.split(" ")[1];
            localStorage.setItem("accessToken", token);
        }
        return res;
    },
    async (err) => {
        const original = err.config;
        if (!original) return Promise.reject(err);
        if (
            (err?.response?.status === 401 || err?.response?.status === 403) &&
            !original._retry
        ) {
            original._retry = true;

            try {
                await api.get("/api/auth/refresh");
                const token = localStorage.getItem("accessToken");
                if (token) {
                    original.headers = original.headers || {};
                    original.headers.Authorization = `Bearer ${token}`;
                }
                return api(original);
            } catch (refreshErr) {
                localStorage.removeItem("accessToken");
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(err);
    }
);

export default api;
