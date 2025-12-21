import { NextFunction, Response } from "express";
import {
  AuthenticatedRequest,
  CreateUserMissionDTO,
  UpdateUserMissionDTO,
} from "../types/index.js";
import { ResponseUtil } from "../utils/response.js";
import { UserMissionService } from "../services/user-mission.service.js";
import { parseId } from "../utils/helpers.js";

export class UserMissionController {
  private service: UserMissionService;

  constructor() {
    this.service = new UserMissionService();
  }

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

  public updateMission = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseId(req.params.id);
      const data: UpdateUserMissionDTO = req.body;
      const updated = await this.service.updateMission(id, data);
      ResponseUtil.success(res, "Mission updated successfully", updated);
    } catch (err) {
      next(err);
    }
  };

  public getUserMissions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const missions = await this.service.getUserMissions(req.user.sub);
      ResponseUtil.success(res, "User missions retrieved successfully", missions);
    } catch (err) {
      next(err);
    }
  };
}
