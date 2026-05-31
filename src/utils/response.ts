import { Response } from "express";
import { ApiResponse } from "../types/index.js";
import { convertDatesToJakarta } from "./timezone.js";

export class ResponseUtil {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    const convertedData = data ? convertDatesToJakarta(data) : data;
    
    const response: ApiResponse<T> = {
      success: true,
      message,
      data: convertedData as T,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    error?: string,
    statusCode: number = 500
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, 201);
  }

  static badRequest(res: Response, message: string, error?: string): Response {
    return this.error(res, message, error, 400);
  }

  static unauthorized(
    res: Response,
    message: string = "Unauthorized"
  ): Response {
    return this.error(res, message, undefined, 401);
  }

  static forbidden(res: Response, message: string = "Forbidden"): Response {
    return this.error(res, message, undefined, 403);
  }

  static notFound(res: Response, message: string, error?: string): Response {
    return this.error(res, message, error, 404);
  }
}
