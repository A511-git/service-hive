export function handleApiError(err, fallbackMessage = "Something went wrong") {
    const apiError = err?.response?.data?.error;

    if (apiError?.name === "VALIDATION_ERROR" && apiError?.details) {
        const msg = Object.entries(apiError.details)
            .map(([field, message]) => `${field}: ${message}`)
            .join(" | ");

        return msg || apiError.message || "Invalid data";
    }

    return (
        apiError?.message ||
        err?.response?.data?.message ||
        err?.message ||
        fallbackMessage
    );
}
