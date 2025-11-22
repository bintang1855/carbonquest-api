import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { AuthenticatedRequest } from "../../types/index.js";
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
router.get(
  "/",
  authMiddleware("org") as any,
  (async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orgs = await organizationService.getAllOrganizations();
      ResponseUtil.success(res, "Organizations retrieved successfully", orgs);
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
