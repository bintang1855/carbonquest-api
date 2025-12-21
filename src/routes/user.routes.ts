import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadLimiter } from "../middleware/rate-limit.middleware.js";
import { UserController } from "../controllers/user.controller.js";

const router = Router();
const controller = new UserController();

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
  controller.getAllUsers as any
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
 *                           profile_image:
 *                             type: string
 *                             example: /files/profile-123.jpg
 *                             nullable: true
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
  controller.getLeaderboard as any
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
  controller.getUserById as any
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
  controller.updatePassword as any
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     description: Update user information (user can only update their own profile)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               last_name:
 *                 type: string
 *                 example: Smith
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               profile_image:
 *                 type: string
 *                 example: /files/profile-123.jpg
 *                 description: Profile image URL (use PUT /users/:id/profile-image to upload)
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - can only update own profile
 *       404:
 *         description: User not found
 */
router.put(
  "/:id",
  authMiddleware("user") as any,
  controller.updateUser as any
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     description: Delete a user account (user can delete their own account, or organization can delete any user)
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
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  authMiddleware() as any,
  controller.deleteUser as any
);

/**
 * @openapi
 * /users/{id}/profile-image:
 *   put:
 *     tags:
 *       - Users
 *     summary: Upload user profile image
 *     description: |
 *       Upload or update profile image for a user (user can only update their own image).
 *       **Security Features:**
 *       - Rate limited: 10 uploads per 15 minutes
 *       - File size: Max 5MB
 *       - Allowed formats: jpg, jpeg, png, gif, webp
 *       - Files stored securely and accessed via /files/:filename
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profile_image
 *             properties:
 *               profile_image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (jpg, jpeg, png, gif, webp, max 5MB)
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       400:
 *         description: No file uploaded or invalid file
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - can only update own profile image
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many requests - rate limit exceeded (max 10 per 15 minutes)
 */
router.put(
  "/:id/profile-image",
  uploadLimiter,
  authMiddleware("user") as any,
  upload.single("profile_image"),
  controller.uploadProfileImage as any
);

export default router;
