import { RequestHandler } from "express";
import { JwtPayload } from "../types/index.js";
export declare const authMiddleware: (requiredRole?: "user" | "org") => RequestHandler;
export declare const generateToken: (payload: Omit<JwtPayload, "iat" | "exp">) => string;
//# sourceMappingURL=auth.middleware.d.ts.map