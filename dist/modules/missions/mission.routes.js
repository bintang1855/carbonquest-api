import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { ResponseUtil } from "../../utils/response.js";
import { MissionService } from "./mission.service.js";
const router = Router();
const missionService = new MissionService();
/**
 * @openapi
 * /missions:
 *   post:
 *     tags:
 *       - Missions
 *     summary: Create a new mission
 *     description: Create a new mission (organization only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Reduce plastic usage
 *               desc:
 *                 type: string
 *                 example: Complete tasks to reduce single-use plastics
 *               points:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Mission created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 */
router.post("/", authMiddleware("org"), (async (req, res, next) => {
    try {
        const data = req.body;
        const mission = await missionService.createMission(data, req.user.sub);
        ResponseUtil.created(res, "Mission created successfully", mission);
    }
    catch (err) {
        next(err);
    }
}));
/**
 * @openapi
 * /missions:
 *   get:
 *     tags:
 *       - Missions
 *     summary: Get all missions
 *     description: Retrieve a list of all missions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Missions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware(), (async (_req, res, next) => {
    try {
        const missions = await missionService.getAllMissions();
        ResponseUtil.success(res, "Missions retrieved successfully", missions);
    }
    catch (err) {
        next(err);
    }
}));
export default router;
//# sourceMappingURL=mission.routes.js.map