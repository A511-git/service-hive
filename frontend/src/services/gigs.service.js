import api from "../api/axios";


export const gigsService = {
    async fetchOpenGigs(params = {}) {
        const res = await api.get("/api/gigs", { params });
        return res.data;
    },
    async createGig(payload) {
        const res = await api.post("/api/gigs", payload);
        return res.data;
    }
}