import jwt from "jsonwebtoken";
import { ResponseUtil } from "../utils/response.js";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-ganti-di-prod";
export const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            ResponseUtil.unauthorized(res, "Unauthorized");
            return;
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            if (requiredRole && decoded.role !== requiredRole) {
                ResponseUtil.forbidden(res, "Forbidden");
                return;
            }
            next();
        }
        catch (err) {
            console.error(err);
            ResponseUtil.unauthorized(res, "Invalid token");
            return;
        }
    };
};
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};
//# sourceMappingURL=auth.middleware.js.map