import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { ResponseUtil } from "../../utils/response.js";
import { UserService } from "./user.service.js";
import { upload } from "../../middleware/upload.middleware.js";
import { uploadLimiter } from "../../middleware/rate-limit.middleware.js";
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
router.get("/", authMiddleware("org"), (async (_req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        ResponseUtil.success(res, "Users retrieved successfully", users);
    }
    catch (err) {
        next(err);
    }
}));
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
 *                             example: /uploads/profile-123.jpg
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
router.get("/leaderboard", authMiddleware(), (async (_req, res, next) => {
    try {
        const leaderboard = await userService.getLeaderboard();
        ResponseUtil.success(res, "Leaderboard retrieved successfully", leaderboard);
    }
    catch (err) {
        next(err);
    }
}));
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
router.get("/:id", authMiddleware(), (async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const user = await userService.getUserById(id);
        ResponseUtil.success(res, "User retrieved successfully", user);
    }
    catch (err) {
        next(err);
    }
}));
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
router.put("/password", authMiddleware("user"), (async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        await userService.updatePassword(req.user.sub, oldPassword, newPassword);
        ResponseUtil.success(res, "Password updated successfully", null);
    }
    catch (err) {
        next(err);
    }
}));
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
 *                 example: /uploads/profile-123.jpg
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
router.put("/:id", authMiddleware("user"), (async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        // Users can only update their own profile
        if (req.user.sub !== id) {
            throw new Error("You can only update your own profile");
        }
        const data = req.body;
        const user = await userService.updateUser(id, data);
        ResponseUtil.success(res, "User updated successfully", user);
    }
    catch (err) {
        next(err);
    }
}));
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
router.delete("/:id", authMiddleware(), (async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        // Users can only delete their own account, org can delete any user
        if (req.user.role === "user" && req.user.sub !== id) {
            throw new Error("You can only delete your own account");
        }
        await userService.deleteUser(id);
        ResponseUtil.success(res, "User deleted successfully", null);
    }
    catch (err) {
        next(err);
    }
}));
/**
 * @openapi
 * /users/{id}/profile-image:
 *   put:
 *     tags:
 *       - Users
 *     summary: Upload user profile image
 *     description: Upload or update profile image for a user (user can only update their own image)
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
 *                 description: Profile image file (jpg, jpeg, png, max 5MB)
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
 */
router.put("/:id/profile-image", uploadLimiter, authMiddleware("user"), upload.single("profile_image"), (async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        // Users can only update their own profile image
        if (req.user.sub !== id) {
            throw new Error("You can only update your own profile image");
        }
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        const profile_image = `/files/${req.file.filename}`;
        const user = await userService.updateProfileImage(id, profile_image);
        ResponseUtil.success(res, "Profile image uploaded successfully", user);
    }
    catch (err) {
        next(err);
    }
}));
export default router;
//# sourceMappingURL=user.routes.js.map