import { useEffect, useMemo, useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import PostGigOverlay from "../components/PostGigOverlay";
import GigCard from "../components/GigCard";
import { gigsService } from "../services/gigs.service";
import { handleApiError } from "../utils/handleApiError";
import BidOverlay from "../components/BidOverlay";
import { Toast } from "primereact/toast";
import { useAuth } from "../context/AuthContext";

export default function GigsDashboard() {
    const [search, setSearch] = useState("");
    const [searchDraft, setSearchDraft] = useState("");

    const [page, setPage] = useState(1); // backend expects 1-based
    const [limit, setLimit] = useState(10);

    const [gigs, setGigs] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalRecords = useMemo(() => {
        return pagination?.totalItems || 0;
    }, [pagination]);

    const [postGigOpen, setPostGigOpen] = useState(false);

    const toast = useRef(null);
    const [bidOpen, setBidOpen] = useState(false);
    const [activeGigForBid, setActiveGigForBid] = useState(null);

    const { isLoggedIn } = useAuth();


    const fetchGigs = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await gigsService.fetchOpenGigs({
                search: search || undefined,
                page,
                limit,
            });

            // ApiResponse(200, result, "Gigs fetched")
            const result = res?.data;

            setGigs(result?.data || []);
            setPagination(result?.pagination || null);
        } catch (err) {
            setGigs([]);
            setPagination(null);
            setError(handleApiError(err, "Failed to fetch gigs"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGigs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, search]);

    const onSearch = () => {
        setPage(1);
        setSearch(searchDraft.trim());
    };

    const onClear = () => {
        setSearchDraft("");
        setSearch("");
        setPage(1);
    };

    return (
        <div className="p-3 md:p-4">
            <Toast ref={toast} />
            <div className="flex flex-column gap-3">
                {/* Header */}
                <Card className="surface-card shadow-1 border-round-lg">
                    <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-column gap-1">
                                <div className="text-2xl font-bold">Open Gigs</div>
                                <div className="text-color-secondary">
                                    Browse gigs and apply
                                </div>
                            </div>
                            {isLoggedIn ? (
                                <Button
                                    label="Post Gig"
                                    icon="pi pi-plus"
                                    onClick={() => setPostGigOpen(true)}
                                />
                            ) : null}

                        </div>



                        {/* RIGHT SIDE */}
                        <div className="flex flex-column md:flex-row gap-2 w-full md:w-auto md:align-items-center">


                            {/* Search */}
                            <span className="p-input-icon-left w-full md:w-20rem">
                                <InputText
                                    value={searchDraft}
                                    onChange={(e) => setSearchDraft(e.target.value)}
                                    placeholder="  Search gigs..."
                                    className="w-full"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") onSearch();
                                    }}
                                />
                            </span>

                            <div className="flex gap-2">
                                <Button label="Search" icon="pi pi-search" onClick={onSearch} />
                                <Button
                                    label="Clear"
                                    icon="pi pi-times"
                                    className="p-button-outlined"
                                    onClick={onClear}
                                />
                            </div>
                        </div>
                    </div>
                </Card>


                {/* Error */}
                {error ? <Message severity="error" text={error} /> : null}

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-content-center p-6">
                        <ProgressSpinner />
                    </div>
                ) : null}

                {/* List */}
                {!loading && gigs.length > 0 ? (
                    <div className="grid">
                        {gigs.map((gig) => (
                            <div key={gig._id} className="col-12 md:col-6 lg:col-4">
                                <GigCard
                                    gig={gig}
                                    // onView={(g) => console.log("View gig", g)}
                                    onBid={(g) => {
                                        setActiveGigForBid(g);
                                        setBidOpen(true);
                                    }}
                                />

                            </div>
                        ))}
                    </div>
                ) : null}

                {/* Empty */}
                {!loading && !error && gigs.length === 0 ? (
                    <Card className="surface-card shadow-1 border-round-lg">
                        <div className="text-center p-4">
                            <div className="text-lg font-semibold">No gigs found</div>
                            <div className="text-color-secondary mt-2">
                                Try changing your search query.
                            </div>
                        </div>
                    </Card>
                ) : null}

                {/* Pagination */}
                <Card className="surface-card shadow-1 border-round-lg">
                    <Paginator
                        first={(page - 1) * limit}
                        rows={limit}
                        totalRecords={totalRecords}
                        rowsPerPageOptions={[6, 12, 24, 48]}
                        onPageChange={(e) => {
                            setLimit(e.rows);
                            setPage(Math.floor(e.first / e.rows) + 1); // convert to 1-based
                        }}
                    />
                </Card>

                <PostGigOverlay
                    visible={postGigOpen}
                    onHide={() => setPostGigOpen(false)}
                    onCreated={() => {
                        // refresh gigs list after creating
                        setPage(1);
                        fetchGigs();
                    }}
                />
                <BidOverlay
                    visible={bidOpen}
                    gig={activeGigForBid}
                    onHide={() => {
                        setBidOpen(false);
                        setActiveGigForBid(null);
                    }}
                    onSubmitted={() => {
                        toast.current?.show({
                            severity: "success",
                            summary: "Bid submitted",
                            detail: "Your bid was submitted successfully",
                            life: 1500,
                        });
                    }}
                />


            </div>
        </div>
    );
}
