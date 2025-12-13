import { Router } from "express";
import { ResponseUtil } from "../../utils/response.js";
import { AuthService } from "./auth.service.js";
const router = Router();
const authService = new AuthService();
/**
 * @openapi
 * /auth/user/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-15
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: 081234567890
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *               profile_image:
 *                 type: string
 *                 example: /uploads/profile-123.jpg
 *                 description: Profile image URL (optional, can be uploaded later)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         token:
 *                           type: string
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post("/user/register", async (req, res, next) => {
    try {
        const data = req.body;
        const result = await authService.registerUser(data);
        ResponseUtil.created(res, "User registered successfully", result);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @openapi
 * /auth/user/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login as a user
 *     description: Authenticate a user and receive a JWT token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         token:
 *                           type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/user/login", async (req, res, next) => {
    try {
        const data = req.body;
        const result = await authService.loginUser(data);
        ResponseUtil.success(res, "User logged in successfully", result);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @openapi
 * /auth/org/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new organization
 *     description: Create a new organization account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Green Corp
 *               email:
 *                 type: string
 *                 format: email
 *                 example: info@greencorp.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *               desc:
 *                 type: string
 *                 example: Environmental sustainability organization
 *     responses:
 *       201:
 *         description: Organization registered successfully
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post("/org/register", async (req, res, next) => {
    try {
        const data = req.body;
        const result = await authService.registerOrganization(data);
        ResponseUtil.created(res, "Organization registered successfully", result);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @openapi
 * /auth/org/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login as an organization
 *     description: Authenticate an organization and receive a JWT token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: info@greencorp.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/org/login", async (req, res, next) => {
    try {
        const data = req.body;
        const result = await authService.loginOrganization(data);
        ResponseUtil.success(res, "Organization logged in successfully", result);
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=auth.routes.js.map