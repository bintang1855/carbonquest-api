import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { AuthenticatedRequest } from "../../types/index.js";
import { ResponseUtil } from "../../utils/response.js";
import { SessionService } from "./session.service.js";

const router = Router();
const sessionService = new SessionService();

/**
 * @openapi
 * /me/sessions:
 *   get:
 *     tags:
 *       - Sessions
 *     summary: Get my sessions
 *     description: Get all sessions for the authenticated user (includes quiz and answer details)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.get(
  "/sessions",
  authMiddleware("user") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sessions = await sessionService.getUserSessions(req.user.sub);
      ResponseUtil.success(res, "Sessions retrieved successfully", sessions);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /me/sessions/weekly-points:
 *   get:
 *     tags:
 *       - Sessions
 *     summary: Get weekly points history
 *     description: Get weekly points breakdown from missions and quizzes for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: weeks
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Number of weeks to retrieve (default 4)
 *     responses:
 *       200:
 *         description: Weekly points history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Weekly points history retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       week:
 *                         type: string
 *                         format: date
 *                         example: "2024-12-08"
 *                         description: Start date of the week (Sunday)
 *                       mission_points:
 *                         type: integer
 *                         example: 150
 *                       quiz_points:
 *                         type: integer
 *                         example: 200
 *                       total_points:
 *                         type: integer
 *                         example: 350
 *                       missions_completed:
 *                         type: integer
 *                         example: 5
 *                       quizzes_completed:
 *                         type: integer
 *                         example: 3
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.get(
  "/sessions/weekly-points",
  authMiddleware("user") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const weeks = req.query.weeks ? Number(req.query.weeks) : 4;
      const weeklyPoints = await sessionService.getWeeklyPointsHistory(
        req.user.sub,
        weeks
      );
      ResponseUtil.success(
        res,
        "Weekly points history retrieved successfully",
        weeklyPoints
      );
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
