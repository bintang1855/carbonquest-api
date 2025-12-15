import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { ResponseUtil } from "../../utils/response.js";
import { OrganizationService } from "./organization.service.js";
const router = Router();
const organizationService = new OrganizationService();
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
router.get("/", authMiddleware("org"), (async (_req, res, next) => {
    try {
        const orgs = await organizationService.getAllOrganizations();
        ResponseUtil.success(res, "Organizations retrieved successfully", orgs);
    }
    catch (err) {
        next(err);
    }
}));
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
router.put("/password", authMiddleware("org"), (async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        await organizationService.updatePassword(req.user.sub, oldPassword, newPassword);
        ResponseUtil.success(res, "Password updated successfully", null);
    }
    catch (err) {
        next(err);
    }
}));
export default router;
//# sourceMappingURL=organization.routes.js.map