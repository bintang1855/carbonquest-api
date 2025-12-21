import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { ResponseUtil } from "../utils/response.js";
import { SessionService } from "../services/session.service.js";

export class SessionController {
  private service: SessionService;

  constructor() {
    this.service = new SessionService();
  }

  /**
   * Get user sessions
   */
  public getUserSessions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sessions = await this.service.getUserSessions(req.user.sub);
      ResponseUtil.success(res, "Sessions retrieved successfully", sessions);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get daily points history
   */
  public getDailyPoints = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const days = req.query.days ? Number(req.query.days) : 7;
      const dailyPoints = await this.service.getWeeklyPointsHistory(
        req.user.sub,
        days
      );
      ResponseUtil.success(
        res,
        "Daily points history retrieved successfully",
        dailyPoints
      );
    } catch (err) {
      next(err);
    }
  };
}
