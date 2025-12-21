import { NextFunction, Response } from "express";
import { AuthenticatedRequest, CreateMissionDTO } from "../types/index.js";
import { ResponseUtil } from "../utils/response.js";
import { MissionService } from "../services/mission.service.js";

export class MissionController {
  private service: MissionService;

  constructor() {
    this.service = new MissionService();
  }

  /**
   * Create a new mission
   */
  public createMission = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateMissionDTO = {
        title: req.body.title,
        tags: req.body.tags,
        desc: req.body.desc || req.body.description,
        photo_caption: req.body.photoCaption,
        author_name: req.body.authorName,
        author_role: req.body.authorRole,
        points: req.body.points ? parseInt(req.body.points) : undefined,
        highlights: req.body.highlights,
      };

      // Add cover image URL if file was uploaded
      if (req.file) {
        data.cover_image = `/files/${req.file.filename}`;
      }

      const mission = await this.service.createMission(data, req.user.sub);
      ResponseUtil.created(res, "Mission created successfully", mission);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get all missions
   */
  public getAllMissions = async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const missions = await this.service.getAllMissions();
      ResponseUtil.success(res, "Missions retrieved successfully", missions);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get mission by ID
   */
  public getMissionById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const mission = await this.service.getMissionById(id);
      ResponseUtil.success(res, "Mission retrieved successfully", mission);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update a mission
   */
  public updateMission = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data: Partial<CreateMissionDTO> = {
        title: req.body.title,
        tags: req.body.tags,
        desc: req.body.desc || req.body.description,
        photo_caption: req.body.photoCaption,
        author_name: req.body.authorName,
        author_role: req.body.authorRole,
        points: req.body.points ? parseInt(req.body.points) : undefined,
        highlights: req.body.highlights,
      };

      // Add cover image URL if file was uploaded
      if (req.file) {
        data.cover_image = `/files/${req.file.filename}`;
      }

      // Remove undefined fields
      Object.keys(data).forEach(
        (key) =>
          data[key as keyof typeof data] === undefined &&
          delete data[key as keyof typeof data]
      );

      const mission = await this.service.updateMission(id, data);
      ResponseUtil.success(res, "Mission updated successfully", mission);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Delete a mission
   */
  public deleteMission = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteMission(id);
      ResponseUtil.success(res, "Mission deleted successfully", null);
    } catch (err) {
      next(err);
    }
  };
}
