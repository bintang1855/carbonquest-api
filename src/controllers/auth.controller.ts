import { NextFunction, Request, Response } from "express";
import {
  CreateOrganizationDTO,
  CreateUserDTO,
  LoginDTO,
} from "../types/index.js";
import { ResponseUtil } from "../utils/response.js";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  public registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateUserDTO = req.body;
      const result = await this.service.registerUser(data);
      ResponseUtil.created(res, "User registered successfully", result);
    } catch (err) {
      next(err);
    }
  };

  public loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: LoginDTO = req.body;
      const result = await this.service.loginUser(data);
      ResponseUtil.success(res, "User logged in successfully", result);
    } catch (err) {
      next(err);
    }
  };

  public registerOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateOrganizationDTO = req.body;
      const result = await this.service.registerOrganization(data);
      ResponseUtil.created(res, "Organization registered successfully", result);
    } catch (err) {
      next(err);
    }
  };

  public loginOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: LoginDTO = req.body;
      const result = await this.service.loginOrganization(data);
      ResponseUtil.success(res, "Organization logged in successfully", result);
    } catch (err) {
      next(err);
    }
  };
}
