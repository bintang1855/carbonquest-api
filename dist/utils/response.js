export class ResponseUtil {
    static success(res, message, data, statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }
    static error(res, message, error, statusCode = 500) {
        const response = {
            success: false,
            message,
            error,
        };
        return res.status(statusCode).json(response);
    }
    static created(res, message, data) {
        return this.success(res, message, data, 201);
    }
    static badRequest(res, message, error) {
        return this.error(res, message, error, 400);
    }
    static unauthorized(res, message = "Unauthorized") {
        return this.error(res, message, undefined, 401);
    }
    static forbidden(res, message = "Forbidden") {
        return this.error(res, message, undefined, 403);
    }
    static notFound(res, message, error) {
        return this.error(res, message, error, 404);
    }
}
//# sourceMappingURL=response.js.map