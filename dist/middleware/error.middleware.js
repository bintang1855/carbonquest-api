export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        const response = {
            success: false,
            message: err.message,
            error: err.message,
        };
        res.status(err.statusCode).json(response);
        return;
    }
    // Unhandled errors
    console.error("Unhandled error:", err);
    const response = {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    };
    res.status(500).json(response);
};
//# sourceMappingURL=error.middleware.js.map