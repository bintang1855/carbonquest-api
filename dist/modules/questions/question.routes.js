import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { ResponseUtil } from "../../utils/response.js";
import { QuestionService } from "./question.service.js";
const router = Router();
const questionService = new QuestionService();
/**
 * @openapi
 * /questions:
 *   post:
 *     tags:
 *       - Questions
 *     summary: Create a new question
 *     description: Create a new question (organization only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: integer
 *                 example: 10
 *               content:
 *                 type: string
 *                 example: What is carbon footprint?
 *               category:
 *                 type: string
 *                 example: Environment
 *     responses:
 *       201:
 *         description: Question created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 */
router.post("/", authMiddleware("org"), (async (req, res, next) => {
    try {
        const data = req.body;
        const question = await questionService.createQuestion(data);
        ResponseUtil.created(res, "Question created successfully", question);
    }
    catch (err) {
        next(err);
    }
}));
/**
 * @openapi
 * /questions:
 *   get:
 *     tags:
 *       - Questions
 *     summary: Get all questions
 *     description: Retrieve a list of all questions with their answers
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware(), (async (_req, res, next) => {
    try {
        const questions = await questionService.getAllQuestions();
        ResponseUtil.success(res, "Questions retrieved successfully", questions);
    }
    catch (err) {
        next(err);
    }
}));
export default router;
//# sourceMappingURL=question.routes.js.map