import { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";

import { gigsService } from "../services/gigs.service";
import { bidsService } from "../services/bids.service";
import { handleApiError } from "../utils/handleApiError";
import BidsTable from "../components/BidsTable";

export default function BidsPage() {
    const toast = useRef(null);

    const [gigs, setGigs] = useState([]);
    const [selectedGig, setSelectedGig] = useState(null);

    const [bids, setBids] = useState([]);
    const [loadingGigs, setLoadingGigs] = useState(false);
    const [loadingBids, setLoadingBids] = useState(false);

    const [error, setError] = useState("");

    const gigOptions = useMemo(() => {
        return gigs.map((g) => ({
            label: g.title,
            value: g,
        }));
    }, [gigs]);

    const loadGigs = async () => {
        setLoadingGigs(true);
        setError("");

        try {
            const res = await gigsService.fetchOpenGigs({ page: 1, limit: 50 });
            const result = res?.data;

            setGigs(result?.data || []);
        } catch (err) {
            setError(handleApiError(err, "Failed to fetch gigs"));
        } finally {
            setLoadingGigs(false);
        }
    };

    const loadBids = async (gigId) => {
        setLoadingBids(true);
        setError("");
        try {
            const res = await bidsService.fetchBidsByGig(gigId);
            setBids(res?.data|| []);
            
        } catch (err) {
            setBids([]);
            setError(handleApiError(err, "Failed to fetch bids"));
        } finally {
            setLoadingBids(false);
        }
    };

    useEffect(() => {
        loadGigs();
    }, []);

    useEffect(() => {
        if (selectedGig?._id) {
            loadBids(selectedGig._id);
        } else {
            setBids([]);
        }
    }, [selectedGig]);

    const onHire = (bid) => {
        confirmDialog({
            message: "Are you sure you want to hire this freelancer?",
            header: "Confirm Hire",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Hire",
            rejectLabel: "Cancel",
            accept: async () => {
                try {
                    await bidsService.hireBid(bid._id);

                    toast.current?.show({
                        severity: "success",
                        summary: "Hired",
                        detail: "Bid hired successfully",
                        life: 1500,
                    });

                    // refresh bids list
                    if (selectedGig?._id) await loadBids(selectedGig._id);
                } catch (err) {
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: handleApiError(err, "Hire failed"),
                        life: 2500,
                    });
                }
            },
        });
    };

    return (
        <div className="p-3 md:p-4">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="flex flex-column gap-3">
                <Card className="surface-card shadow-1 border-round-lg">
                    <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
                        <div>
                            <div className="text-2xl font-bold">Bids</div>
                            <div className="text-color-secondary mt-1">
                                View and hire bids for your gig
                            </div>
                        </div>

                        <div className="flex gap-2 align-items-center w-full md:w-auto">
                            <Dropdown
                                value={selectedGig}
                                options={gigOptions}
                                onChange={(e) => setSelectedGig(e.value)}
                                placeholder={loadingGigs ? "Loading gigs..." : "Select a gig"}
                                className="w-full md:w-20rem"
                                filter
                            />

                            <Button
                                icon="pi pi-refresh"
                                className="p-button-outlined"
                                onClick={loadGigs}
                            />
                        </div>
                    </div>
                </Card>

                {error ? <Message severity="error" text={error} /> : null}

                {selectedGig ? (
                    <BidsTable bids={bids} loading={loadingBids} onHire={onHire} />
                ) : (
                    <Card className="surface-card shadow-1 border-round-lg">
                        <div className="text-center p-4">
                            <div className="text-lg font-semibold">Select a gig</div>
                            <div className="text-color-secondary mt-2">
                                Choose a gig to view all received bids.
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
