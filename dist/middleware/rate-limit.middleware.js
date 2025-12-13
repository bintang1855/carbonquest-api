import rateLimit from "express-rate-limit";
// Rate limiter untuk endpoint upload (10 requests per 15 menit)
export const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10, // Max 10 requests per windowMs
    message: {
        success: false,
        message: "Terlalu banyak upload dari IP ini. Silakan coba lagi setelah 15 menit.",
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
// Rate limiter untuk API umum (100 requests per 15 menit)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Max 100 requests per windowMs
    message: {
        success: false,
        message: "Terlalu banyak request dari IP ini. Silakan coba lagi setelah 15 menit.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rate-limit.middleware.js.map