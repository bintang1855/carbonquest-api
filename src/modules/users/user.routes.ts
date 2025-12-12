import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { AuthenticatedRequest } from "../../types/index.js";
import { ResponseUtil } from "../../utils/response.js";
import { UserService } from "./user.service.js";

const router = Router();
const userService = new UserService();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users (organization only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 */
router.get(
  "/",
  authMiddleware("org") as any,
  (async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await userService.getAllUsers();
      ResponseUtil.success(res, "Users retrieved successfully", users);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /users/leaderboard:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get leaderboard
 *     description: Retrieve user leaderboard sorted by total points (sessions + missions)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_user:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                           email:
 *                             type: string
 *                             example: john@example.com
 *                           total_points:
 *                             type: integer
 *                             example: 350
 *                           session_points:
 *                             type: integer
 *                             example: 150
 *                           mission_points:
 *                             type: integer
 *                             example: 200
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/leaderboard",
  authMiddleware() as any,
  (async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const leaderboard = await userService.getLeaderboard();
      ResponseUtil.success(
        res,
        "Leaderboard retrieved successfully",
        leaderboard
      );
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  authMiddleware() as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const user = await userService.getUserById(id);
      ResponseUtil.success(res, "User retrieved successfully", user);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /users/password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user password
 *     description: Update the password for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid old password
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put(
  "/password",
  authMiddleware("user") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { oldPassword, newPassword } = req.body;
      await userService.updatePassword(req.user.sub, oldPassword, newPassword);
      ResponseUtil.success(res, "Password updated successfully", null);
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
