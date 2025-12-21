import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { ResponseUtil } from "../utils/response.js";
import { OrganizationService } from "../services/organization.service.js";

export class OrganizationController {
  private service: OrganizationService;

  constructor() {
    this.service = new OrganizationService();
  }

  public getAllOrganizations = async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orgs = await this.service.getAllOrganizations();
      ResponseUtil.success(res, "Organizations retrieved successfully", orgs);
    } catch (err) {
      next(err);
    }
  };

  public updatePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { oldPassword, newPassword } = req.body;
      await this.service.updatePassword(req.user.sub, oldPassword, newPassword);
      ResponseUtil.success(res, "Password updated successfully", null);
    } catch (err) {
      next(err);
    }
  };
}
