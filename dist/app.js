import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
// Import routes
import answerRoutes from "./modules/answers/answer.routes.js";
import articleRoutes from "./modules/articles/article.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import missionRoutes from "./modules/missions/mission.routes.js";
import organizationRoutes from "./modules/organizations/organization.routes.js";
import questionRoutes from "./modules/questions/question.routes.js";
import sessionRoutes from "./modules/sessions/session.routes.js";
import userMissionRoutes from "./modules/user-missions/user-mission.routes.js";
import userRoutes from "./modules/users/user.routes.js";
export const createApp = () => {
    const app = express();
    // Global middleware
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
    app.use("/auth", authRoutes);
    app.use("/users", userRoutes);
    app.use("/organizations", organizationRoutes);
    app.use("/missions", missionRoutes);
    app.use("/user-missions", userMissionRoutes);
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