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
 * /me/sessions/daily-points:
 *   get:
 *     tags:
 *       - Sessions
 *     summary: Get daily points history
 *     description: Get daily points breakdown from missions and quizzes for the authenticated user (last N days)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to retrieve (default 7)
 *     responses:
 *       200:
 *         description: Daily points history retrieved successfully
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
 *                   example: Daily points history retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       week:
 *                         type: string
 *                         format: date
 *                         example: "2024-12-24"
 *                         description: Date in YYYY-MM-DD format
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
 *                         example: 3
 *                       quizzes_completed:
 *                         type: integer
 *                         example: 2
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.get(
  "/sessions/daily-points",
  authMiddleware("user") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const days = req.query.days ? Number(req.query.days) : 7;
      const dailyPoints = await sessionService.getWeeklyPointsHistory(
        req.user.sub,
        days
      );
      ResponseUtil.success(
        res,
        "Daily points history retrieved successfully",
        dailyPoints
      );
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
