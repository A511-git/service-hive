import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useAuth } from "../context/AuthContext";

export default function GigCard({ gig, onView, onBid }) {
    if (!gig) return null;
    const { isLoggedIn } = useAuth();

    return (
        <Card className="surface-card shadow-1 border-round-lg">
            <div className="flex flex-column gap-3">
                {/* Header */}
                <div className="flex justify-content-between align-items-start gap-2">
                    <div className="flex flex-column gap-1">
                        <div className="text-lg font-semibold">
                            {gig.title}
                        </div>
                        <div className="text-sm text-color-secondary">
                            Posted on {new Date(gig.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <Tag
                        value={gig.status}
                        severity={gig.status === "open" ? "success" : "warning"}
                    />
                </div>

                {/* Description */}
                <div className="text-sm line-height-3">
                    {gig.description.length > 180
                        ? gig.description.slice(0, 180) + "..."
                        : gig.description}
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-wallet text-primary" />
                        <span className="font-medium">₹ {gig.budget}</span>
                    </div>

                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-calendar text-primary" />
                        <span>
                            Deadline:{" "}
                            {new Date(gig.deadline).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-content-end gap-2">
                    {/* <Button
                        label="View"
                        icon="pi pi-eye"
                        className="p-button-text"
                        onClick={() => onView?.(gig)}
                    /> */}
                    {isLoggedIn ? (
                        <Button
                            label="Bid"
                            icon="pi pi-send"
                            onClick={() => onBid?.(gig)}
                        />
                    ) : null}
                </div>
            </div>
        </Card>
    );
}
