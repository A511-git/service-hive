import api from "../api/axios";

export const bidsService = {
    async submitBid(payload) {
        const res = await api.post("/api/bids", payload);
        return res.data;
    },
    async fetchBidsByGig(gigId) {
        const res = await api.get(`/api/bids/${gigId}`);
        return res.data;
    },
    async hireBid(bidId) {
        const res = await api.patch(`/api/bids/${bidId}/hire`);
        return res.data;
    }
}