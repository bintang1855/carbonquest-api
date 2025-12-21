import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { ResponseUtil } from "../utils/response.js";
import { UserService } from "../services/user.service.js";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  /**
   * Get all users
   */
  public getAllUsers = async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.service.getAllUsers();
      ResponseUtil.success(res, "Users retrieved successfully", users);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get leaderboard
   */
  public getLeaderboard = async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const leaderboard = await this.service.getLeaderboard();
      ResponseUtil.success(
        res,
        "Leaderboard retrieved successfully",
        leaderboard
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get user by ID
   */
  public getUserById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const user = await this.service.getUserById(id);
      ResponseUtil.success(res, "User retrieved successfully", user);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update user password
   */
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

  /**
   * Update user profile
   */
  public updateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      // Users can only update their own profile
      if (req.user.sub !== id) {
        throw new Error("You can only update your own profile");
      }

      const data = req.body;
      const user = await this.service.updateUser(id, data);
      ResponseUtil.success(res, "User updated successfully", user);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Delete a user
   */
  public deleteUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      // Users can only delete their own account, org can delete any user
      if (req.user.role === "user" && req.user.sub !== id) {
        throw new Error("You can only delete your own account");
      }

      await this.service.deleteUser(id);
      ResponseUtil.success(res, "User deleted successfully", null);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Upload user profile image
   */
  public uploadProfileImage = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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
      const user = await this.service.updateProfileImage(id, profile_image);
      ResponseUtil.success(res, "Profile image uploaded successfully", user);
    } catch (err) {
      next(err);
    }
  };
}
