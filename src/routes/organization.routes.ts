import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { OrganizationController } from "../controllers/organization.controller.js";

const router = Router();
const controller = new OrganizationController();

/**
 * @openapi
 * /organizations:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: Get all organizations
 *     description: Retrieve a list of all organizations (organization only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Organizations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 */
router.get(
  "/",
  authMiddleware("org") as any,
  controller.getAllOrganizations as any
);

/**
 * @openapi
 * /organizations/password:
 *   put:
 *     tags:
 *       - Organizations
 *     summary: Update organization password
 *     description: Update the password for the authenticated organization
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
 *       403:
 *         description: Forbidden - organization role required
 *       404:
 *         description: Organization not found
 */
router.put(
  "/password",
  authMiddleware("org") as any,
  controller.updatePassword as any
);

export default router;
