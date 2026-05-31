import cors from "cors";
import express, { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { authLimiter, limiter } from "./middleware/rate-limit.middleware.js";

import articleRoutes from "./routes/article.routes.js";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import missionRoutes from "./routes/mission.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import userMissionRoutes from "./routes/user-mission.routes.js";
import userRoutes from "./routes/user.routes.js";

export const createApp = (): Application => {
  const app = express();

  app.set("trust proxy", 1);

  app.use(limiter);
  app.use(cors());
  app.use(express.json());

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

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "CarbonQuest API Documentation",
    })
  );

  app.use("/auth", authLimiter, authRoutes);
  app.use("/files", fileRoutes);
  app.use("/users", userRoutes);
  app.use("/organizations", organizationRoutes);
  app.use("/missions", missionRoutes);
  app.use("/user-missions", userMissionRoutes);
  app.use("/quizzes", quizRoutes);
  app.use("/me", sessionRoutes);
  app.use("/me", userMissionRoutes);
  app.use("/articles", articleRoutes);

  app.use(errorHandler);

  return app;
};
