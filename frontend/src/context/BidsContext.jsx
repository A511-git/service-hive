import React, { createContext, useContext, useMemo, useState } from "react";
import {bidsService} from "../services/bids.service";

const BidsContext = createContext(null);

export function BidsProvider({ children }) {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const postBid = async (payload) => {
        try {
            setLoading(true);
            setError(null);

            const res = await bidsService.submitBid(payload);
            if (res?.data) setBids((prev) => [res.data, ...prev]);

            return res;
        } catch (err) {
            const msg = err?.response?.data?.error?.message || err.message;
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getBidsByGig = async (gigId) => {
        try {
            setLoading(true);
            setError(null);

            const res = await bidsService.fetchBidsByGig(gigId);
            setBids(res?.data || []);
            return res;
        } catch (err) {
            const msg = err?.response?.data?.error?.message || err.message;
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const hire = async (bidId) => {
        try {
            setLoading(true);
            setError(null);

            const res = await bidsService.hireBid(bidId);
            return res;
        } catch (err) {
            const msg = err?.response?.data?.error?.message || err.message;
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo(
        () => ({
            bids,
            loading,
            error,
            postBid,
            getBidsByGig,
            hire,
            setBids,
        }),
        [bids, loading, error]
    );

    return <BidsContext.Provider value={value}>{children}</BidsContext.Provider>;
}

export function useBids() {
    const ctx = useContext(BidsContext);
    if (!ctx) throw new Error("useBids must be used within BidsProvider");
    return ctx;
}
