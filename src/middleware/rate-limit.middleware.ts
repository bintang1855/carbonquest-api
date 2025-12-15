import rateLimit from "express-rate-limit";

// Rate limiter global - membatasi request per IP
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100, // max 100 request per 1 menit per IP
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Rate limiter khusus untuk auth (lebih ketat)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // max 5 login attempts per 15 menit per IP
  message: {
    success: false,
    message: "Too many login attempts from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter untuk endpoint upload (10 requests per 15 menit)
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Max 10 requests per windowMs
  message: {
    success: false,
    message:
      "Terlalu banyak upload dari IP ini. Silakan coba lagi setelah 15 menit.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
