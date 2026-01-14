import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function BidsTable({ bids, loading, onHire }) {
    const statusBody = (row) => {
        const severity =
            row.status === "hired"
                ? "success"
                : row.status === "rejected"
                    ? "danger"
                    : "warning";

        return <Tag value={row.status} severity={severity} />;
    };

    const priceBody = (row) => <span className="font-semibold">₹ {row.price}</span>;

    const actionsBody = (row) => (
        <Button
            label="Hire"
            icon="pi pi-check"
            disabled={row.status !== "pending"}
            onClick={() => onHire?.(row)}
        />
    );

    return (
        <DataTable
            value={bids}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            className="surface-card border-round-lg shadow-1"
            emptyMessage="No bids found"
        >
            <Column field="freelancerId.name" header="Freelancer Name" />
            <Column field="freelancerId.email" header="Freelancer Email" />
            <Column field="message" header="Message" />
            <Column body={priceBody} header="Price" style={{ width: "10rem" }} />
            <Column body={statusBody} header="Status" style={{ width: "8rem" }} />
            <Column body={actionsBody} header="Actions" style={{ width: "10rem" }} />
        </DataTable>
    );
}
