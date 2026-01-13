import { AppError, ValidationError } from './app-errors.js'

const ErrorHandler = async (err, req, res, next) => {

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";



    if (err instanceof AppError && err.isOperational) {
        console.error("OPERATIONAL ERROR", {
            name: err?.name,
            message: err?.message,
            stack: err?.stack,
            cause: err?.cause,
        });

        if (err instanceof ValidationError) {
            return res.status(err.statusCode).json({
                success: false,
            error: {
                name: err.name,
                message,
                details: err.errorStack,
            },
            })
        }
        return res.status(statusCode).json({
            success: false,
            error: {
                name: err.name,
                message,
            },
        });
    }


    console.error("NON-OPERATIONAL ERROR", {
        message: err.message,
        stack: err.stack,
        cause: err.cause,
    });


    return res.status(500).json({
        success: false,
        error: {
            name: "INTERNAL_ERROR",
            message: "Something went wrong",
        },
    });
}
export { ErrorHandler }