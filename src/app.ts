import cors from "cors";
import express, { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { authLimiter, limiter } from "./middleware/rate-limit.middleware.js";

// Import routes
import articleRoutes from "./modules/articles/article.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import fileRoutes from "./modules/files/file.routes.js";
import missionRoutes from "./modules/missions/mission.routes.js";
import organizationRoutes from "./modules/organizations/organization.routes.js";
import quizRoutes from "./modules/quizzes/quiz.routes.js";
import sessionRoutes from "./modules/sessions/session.routes.js";
import userMissionRoutes from "./modules/user-missions/user-mission.routes.js";
import userRoutes from "./modules/users/user.routes.js";

export const createApp = (): Application => {
  const app = express();

  // Trust proxy - penting untuk rate limiting di balik Cloudflare/reverse proxy
  app.set("trust proxy", 1);

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
  app.get("/", (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Gamification API OK",
    });
  });

  // Swagger documentation
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "CarbonQuest API Documentation",
    })
  );

  // Mount routes
  app.use("/auth", authLimiter, authRoutes); // Apply rate limit khusus untuk auth
  app.use("/files", fileRoutes); // Secure file access
  app.use("/users", userRoutes);
  app.use("/organizations", organizationRoutes);
  app.use("/missions", missionRoutes);
  app.use("/user-missions", userMissionRoutes);
  app.use("/quizzes", quizRoutes);
  app.use("/me", sessionRoutes); // /me/sessions & /me/sessions/weekly-points
  app.use("/me", userMissionRoutes); // /me/missions
  app.use("/articles", articleRoutes);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};
