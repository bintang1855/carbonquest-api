import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  AuthenticatedRequest,
  CreateUserMissionDTO,
  UpdateUserMissionDTO,
} from "../../types/index.js";
import { ResponseUtil } from "../../utils/response.js";
import { UserMissionService } from "./user-mission.service.js";

const router = Router();
const userMissionService = new UserMissionService();

/**
 * @openapi
 * /user-missions:
 *   post:
 *     tags:
 *       - User Missions
 *     summary: Start a mission
 *     description: User starts working on a mission
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_mission
 *             properties:
 *               id_mission:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Mission started successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.post(
  "/",
  authMiddleware("user") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateUserMissionDTO = req.body;
      const working = await userMissionService.startMission(data, req.user.sub);
      ResponseUtil.created(res, "Mission started successfully", working);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /user-missions/{id}:
 *   put:
 *     tags:
 *       - User Missions
 *     summary: Update mission progress
 *     description: Update status and points for a user's mission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User mission ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: completed
 *               points:
 *                 type: integer
 *                 example: 100
 *               completed_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Mission updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.put(
  "/:id",
  authMiddleware("user") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const data: UpdateUserMissionDTO = req.body;
      const updated = await userMissionService.updateMission(id, data);
      ResponseUtil.success(res, "Mission updated successfully", updated);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /me/missions:
 *   get:
 *     tags:
 *       - User Missions
 *     summary: Get my missions
 *     description: Get all missions for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Missions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.get(
  "/me/missions",
  authMiddleware("user") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const missions = await userMissionService.getUserMissions(req.user.sub);
      ResponseUtil.success(
        res,
        "User missions retrieved successfully",
        missions
      );
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
