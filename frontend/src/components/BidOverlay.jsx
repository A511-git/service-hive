import { useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";

import { bidsService } from "../services/bids.service";
import { handleApiError } from "../utils/handleApiError";

export default function BidOverlay({ visible, onHide, gig, onSubmitted }) {
    const [price, setPrice] = useState(null);
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const disabled = useMemo(() => {
        return loading || !gig?._id || !price || !message.trim();
    }, [loading, gig, price, message]);

    const reset = () => {
        setPrice(null);
        setMessage("");
        setError("");
    };

    const submit = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await bidsService.submitBid({
                gigId: gig._id,
                price: Number(price),
                message: message.trim(),
            });

            reset();
            onHide?.();
            onSubmitted?.(res);
        } catch (err) {
            setError(handleApiError(err, "Failed to submit bid"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            header="Submit Bid"
            visible={visible}
            onHide={() => {
                reset();
                onHide?.();
            }}
            modal
            draggable={false}
            className="w-full md:w-30rem"
        >
            <div className="flex flex-column gap-3">
                <div>
                    <div className="font-semibold text-lg">{gig?.title || "Gig"}</div>
                    <div className="text-sm text-color-secondary mt-1">
                        Enter your bid details
                    </div>
                </div>

                {error ? <Message severity="error" text={error} /> : null}

                <div className="flex flex-column gap-2">
                    <label className="font-medium">Bid Price (₹)</label>
                    <InputNumber
                        value={price}
                        onValueChange={(e) => setPrice(e.value)}
                        className="w-full"
                        inputClassName="w-full"
                        min={0}
                        placeholder="e.g. 2200"
                    />
                </div>

                <div className="flex flex-column gap-2">
                    <label className="font-medium">Message</label>
                    <InputTextarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full"
                        placeholder="Explain how you will complete this gig..."
                    />
                </div>

                <Divider className="my-2" />

                <div className="flex justify-content-end gap-2">
                    <Button
                        label="Cancel"
                        className="p-button-text"
                        onClick={() => {
                            reset();
                            onHide?.();
                        }}
                    />
                    <Button
                        label={loading ? "Submitting..." : "Submit Bid"}
                        icon={loading ? "pi pi-spin pi-spinner" : "pi pi-send"}
                        disabled={disabled}
                        onClick={submit}
                    />
                </div>
            </div>
        </Dialog>
    );
}
