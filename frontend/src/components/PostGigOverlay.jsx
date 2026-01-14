import { useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";

import { gigsService } from "../services/gigs.service";
import { handleApiError } from "../utils/handleApiError";

export default function PostGigOverlay({ visible, onHide, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState(null);
    const [deadline, setDeadline] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const disabled = useMemo(() => {
        return (
            loading ||
            !title.trim() ||
            !description.trim() ||
            !budget ||
            !deadline
        );
    }, [loading, title, description, budget, deadline]);

    const reset = () => {
        setTitle("");
        setDescription("");
        setBudget(null);
        setDeadline(null);
        setError("");
    };

    const submit = async () => {
        setError("");
        setLoading(true);

        try {
            // backend expects: title, description, budget(number), deadline(date)
            const res = await gigsService.createGig({
                title: title.trim(),
                description: description.trim(),
                budget: Number(budget),
                deadline, // axios sends ISO automatically
            });

            reset();
            onHide?.();
            onCreated?.(res);
        } catch (err) {
            setError(handleApiError(err, "Failed to create gig"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            header="Post a New Gig"
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
                {error ? <Message severity="error" text={error} /> : null}

                <div className="flex flex-column gap-2">
                    <label className="font-medium">Title</label>
                    <InputText
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Build a landing page"
                        className="w-full"
                    />
                </div>

                <div className="flex flex-column gap-2">
                    <label className="font-medium">Description</label>
                    <InputText
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write brief details..."
                        className="w-full"
                    />
                </div>

                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label className="font-medium">Budget (₹)</label>
                            <InputNumber
                                value={budget}
                                onValueChange={(e) => setBudget(e.value)}
                                className="w-full"
                                inputClassName="w-full"
                                min={0}
                                placeholder="2500"
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label className="font-medium">Deadline</label>
                            <Calendar
                                value={deadline}
                                onChange={(e) => setDeadline(e.value)}
                                className="w-full"
                                inputClassName="w-full"
                                placeholder="Select date"
                                showIcon
                                dateFormat="dd/mm/yy"
                                minDate={new Date()}
                            />
                        </div>
                    </div>
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
                        label={loading ? "Posting..." : "Post Gig"}
                        icon={loading ? "pi pi-spin pi-spinner" : "pi pi-upload"}
                        disabled={disabled}
                        onClick={submit}
                    />
                </div>
            </div>
        </Dialog>
    );
}
