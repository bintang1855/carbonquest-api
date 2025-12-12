import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { ResponseUtil } from "../../utils/response.js";
import { SessionService } from "./session.service.js";
const router = Router();
const sessionService = new SessionService();
/**
 * @openapi
 * /sessions:
 *   post:
 *     tags:
 *       - Sessions
 *     summary: Create a new session
 *     description: Start a new quiz/game session (user only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_answer
 *             properties:
 *               id_answer:
 *                 type: integer
 *                 example: 1
 *               total_points:
 *                 type: integer
 *                 example: 0
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Session created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.post("/", authMiddleware("user"), (async (req, res, next) => {
    try {
        const data = req.body;
        const session = await sessionService.createSession(data, req.user.sub);
        ResponseUtil.created(res, "Session created successfully", session);
    }
    catch (err) {
        next(err);
    }
}));
/**
 * @openapi
 * /sessions/{id}:
 *   put:
 *     tags:
 *       - Sessions
 *     summary: Update a session
 *     description: Update session end time and total points (user only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Session ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total_points:
 *                 type: integer
 *                 example: 50
 *               end_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.put("/:id", authMiddleware("user"), (async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;
        const updated = await sessionService.updateSession(id, data);
        ResponseUtil.success(res, "Session updated successfully", updated);
    }
    catch (err) {
        next(err);
    }
}));
/**
 * @openapi
 * /me/sessions:
 *   get:
 *     tags:
 *       - Sessions
 *     summary: Get my sessions
 *     description: Get all sessions for the authenticated user
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
router.get("/me/sessions", authMiddleware("user"), (async (req, res, next) => {
    try {
        const sessions = await sessionService.getUserSessions(req.user.sub);
        ResponseUtil.success(res, "Sessions retrieved successfully", sessions);
    }
    catch (err) {
        next(err);
    }
}));
export default router;
//# sourceMappingURL=session.routes.js.map