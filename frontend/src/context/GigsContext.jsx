import React, { createContext, useContext, useMemo, useState } from "react";
import { gigsService } from "../services/gigs.service";

const GigsContext = createContext(null);

export function GigsProvider({ children }) {
    const [gigs, setGigs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getGigs = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const res = await gigsService.fetchOpenGigs(params);
            setGigs(res?.data?.data || []);
            setPagination(res?.data?.pagination || null);

            return res;
        } catch (err) {
            const msg = err?.response?.data?.error?.message || err.message;
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const postGig = async (payload) => {
        try {
            setLoading(true);
            setError(null);

            const res = await gigsService.createGig(payload);
            if (res?.data) setGigs((prev) => [res.data, ...prev]);

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
            gigs,
            pagination,
            loading,
            error,
            getGigs,
            postGig,
            setGigs,
        }),
        [gigs, pagination, loading, error]
    );

    return <GigsContext.Provider value={value}>{children}</GigsContext.Provider>;
}

export function useGigs() {
    const ctx = useContext(GigsContext);
    if (!ctx) throw new Error("useGigs must be used within GigsProvider");
    return ctx;
}
