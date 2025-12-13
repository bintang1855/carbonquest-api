import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import { uploadLimiter } from "../../middleware/rate-limit.middleware.js";
import { ResponseUtil } from "../../utils/response.js";
import { MissionService } from "./mission.service.js";
const router = Router();
const missionService = new MissionService();
/**
 * @openapi
 * /missions:
 *   post:
 *     tags:
 *       - Missions
 *     summary: Create a new mission
 *     description: Create a new mission with optional cover image (organization only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Reduce plastic usage
 *               tags:
 *                 type: string
 *                 example: education, sustainability
 *               desc:
 *                 type: string
 *                 example: Complete tasks to reduce single-use plastics
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file
 *               photoCaption:
 *                 type: string
 *                 example: Plastic reduction campaign
 *               authorName:
 *                 type: string
 *                 example: Jane Doe
 *               authorRole:
 *                 type: string
 *                 example: Admin
 *               points:
 *                 type: integer
 *                 example: 100
 *               highlights:
 *                 type: string
 *                 example: Key mission objectives and benefits
 *     responses:
 *       201:
 *         description: Mission created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 */
router.post("/", uploadLimiter, authMiddleware("org"), upload.single("coverImage"), (async (req, res, next) => {
    try {
        const data = {
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
        const mission = await missionService.createMission(data, req.user.sub);
        ResponseUtil.created(res, "Mission created successfully", mission);
    }
    catch (err) {
        next(err);
    }
}));
/**
 * @openapi
 * /missions:
 *   get:
 *     tags:
 *       - Missions
 *     summary: Get all missions
 *     description: Retrieve a list of all missions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Missions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware(), (async (_req, res, next) => {
    try {
        const missions = await missionService.getAllMissions();
        ResponseUtil.success(res, "Missions retrieved successfully", missions);
    }
    catch (err) {
        next(err);
    }
}));
/**
 * @openapi
 * /missions/{id}:
 *   get:
 *     tags:
 *       - Missions
 *     summary: Get mission by ID
 *     description: Retrieve a single mission by its ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mission ID
 *     responses:
 *       200:
 *         description: Mission retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Mission not found
 */
router.get("/:id", authMiddleware(), (async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const mission = await missionService.getMissionById(id);
        ResponseUtil.success(res, "Mission retrieved successfully", mission);
    }
    catch (err) {
        next(err);
    }
}));
/**
 * @openapi
 * /missions/{id}:
 *   put:
 *     tags:
 *       - Missions
 *     summary: Update a mission
 *     description: Update an existing mission (organization only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mission ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               tags:
 *                 type: string
 *               desc:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               photoCaption:
 *                 type: string
 *               authorName:
 *                 type: string
 *               authorRole:
 *                 type: string
 *               points:
 *                 type: integer
 *               highlights:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mission updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 *       404:
 *         description: Mission not found
 */
router.put("/:id", uploadLimiter, authMiddleware("org"), upload.single("coverImage"), (async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = {
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
        Object.keys(data).forEach((key) => data[key] === undefined &&
            delete data[key]);
        const mission = await missionService.updateMission(id, data);
        ResponseUtil.success(res, "Mission updated successfully", mission);
    }
    catch (err) {
        next(err);
    }
}));
/**
 * @openapi
 * /missions/{id}:
 *   delete:
 *     tags:
 *       - Missions
 *     summary: Delete a mission
 *     description: Delete an existing mission (organization only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mission ID
 *     responses:
 *       200:
 *         description: Mission deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 *       404:
 *         description: Mission not found
 */
router.delete("/:id", authMiddleware("org"), (async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await missionService.deleteMission(id);
        ResponseUtil.success(res, "Mission deleted successfully", null);
    }
    catch (err) {
        next(err);
    }
}));
export default router;
//# sourceMappingURL=mission.routes.js.map