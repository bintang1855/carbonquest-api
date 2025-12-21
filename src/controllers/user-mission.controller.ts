import { NextFunction, Response } from "express";
import {
  AuthenticatedRequest,
  CreateUserMissionDTO,
  UpdateUserMissionDTO,
} from "../types/index.js";
import { ResponseUtil } from "../utils/response.js";
import { UserMissionService } from "../services/user-mission.service.js";

export class UserMissionController {
  private service: UserMissionService;

  constructor() {
    this.service = new UserMissionService();
  }

  /**
   * Start a mission
   */
  public startMission = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateUserMissionDTO = req.body;
      const working = await this.service.startMission(data, req.user.sub);
      ResponseUtil.created(res, "Mission started successfully", working);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update mission progress
   */
  public updateMission = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const data: UpdateUserMissionDTO = req.body;
      const updated = await this.service.updateMission(id, data);
      ResponseUtil.success(res, "Mission updated successfully", updated);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get user's missions
   */
  public getUserMissions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const missions = await this.service.getUserMissions(req.user.sub);
      ResponseUtil.success(
        res,
        "User missions retrieved successfully",
        missions
      );
    } catch (err) {
      next(err);
    }
  };
}
