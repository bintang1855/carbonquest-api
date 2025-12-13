import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
// Import routes
import answerRoutes from "./modules/answers/answer.routes.js";
import articleRoutes from "./modules/articles/article.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import fileRoutes from "./modules/files/file.routes.js";
import missionRoutes from "./modules/missions/mission.routes.js";
import organizationRoutes from "./modules/organizations/organization.routes.js";
import questionRoutes from "./modules/questions/question.routes.js";
import quizRoutes from "./modules/quizzes/quiz.routes.js";
import sessionRoutes from "./modules/sessions/session.routes.js";
import userMissionRoutes from "./modules/user-missions/user-mission.routes.js";
import userRoutes from "./modules/users/user.routes.js";
export const createApp = () => {
    const app = express();
    // Trust proxy - penting untuk rate limiting di balik Cloudflare/reverse proxyyy
    app.set("trust proxy", 1);
    // Rate limiter - membatasi request per IP
    const limiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 menit
        max: 10000, // max 10 request per 1 menit per IP
        message: {
            success: false,
            message: "Too many requests from this IP, please try again later.",
        },
        standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
        legacyHeaders: false, // Disable `X-RateLimit-*` headers
        handler: (req, res) => {
            console.log(`Rate limit exceeded for IP: ${req.ip}`);
            res.status(429).json({
                success: false,
                message: "Too many requests from this IP, please try again later.",
            });
        },
        skip: (req) => {
            console.log(`Request from IP: ${req.ip}`);
            return false;
        },
    });
    // Rate limiter khusus untuk auth (lebih ketat)
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 menit
        max: 5, // max 5 login attempts per 15 menit per IP
        message: {
            success: false,
            message: "Too many login attempts from this IP, please try again later.",
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    // Global middleware
    app.use(limiter); // Apply rate limit ke semua routes
    app.use(cors());
    app.use(express.json());
    // Health check endpoint
    /**
     * @openapi
     * /:
     *   get:
     *     tags:
     *       - Health
     *     summary: Health check
     *     description: Check if the API is running
     *     security: []
     *     responses:
     *       200:
     *         description: API is healthy
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     message:
     *                       type: string
     *                       example: Gamification API OK
     */
    app.get("/", (_req, res) => {
        res.json({
            success: true,
            message: "Gamification API OK",
        });
    });
    // Swagger documentation
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customSiteTitle: "CarbonQuest API Documentation",
    }));
    // Mount routes
    app.use("/auth", authLimiter, authRoutes); // Apply rate limit khusus untuk auth
    app.use("/files", fileRoutes); // Secure file access
    app.use("/users", userRoutes);
    app.use("/organizations", organizationRoutes);
    app.use("/missions", missionRoutes);
    app.use("/user-missions", userMissionRoutes);
    app.use("/quizzes", quizRoutes);
    app.use("/questions", questionRoutes);
    app.use("/", answerRoutes); // Answer routes include /questions/:id/answers
    app.use("/sessions", sessionRoutes);
    app.use("/me", sessionRoutes); // /me/sessions
    app.use("/me", userMissionRoutes); // /me/missions
    app.use("/articles", articleRoutes);
    // Global error handler (must be last)
    app.use(errorHandler);
    return app;
};
//# sourceMappingURL=app.js.map