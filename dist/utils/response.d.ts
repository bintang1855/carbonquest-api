import { Response } from "express";
export declare class ResponseUtil {
    static success<T>(res: Response, message: string, data?: T, statusCode?: number): Response;
    static error(res: Response, message: string, error?: string, statusCode?: number): Response;
    static created<T>(res: Response, message: string, data?: T): Response;
    static badRequest(res: Response, message: string, error?: string): Response;
    static unauthorized(res: Response, message?: string): Response;
    static forbidden(res: Response, message?: string): Response;
    static notFound(res: Response, message: string, error?: string): Response;
}
//# sourceMappingURL=response.d.ts.map