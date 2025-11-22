import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { AuthenticatedRequest, CreateAnswerDTO } from "../../types/index.js";
import { ResponseUtil } from "../../utils/response.js";
import { AnswerService } from "./answer.service.js";

const router = Router();
const answerService = new AnswerService();

/**
 * @openapi
 * /questions/{id}/answers:
 *   post:
 *     tags:
 *       - Answers
 *     summary: Create an answer for a question
 *     description: Create a new answer for a specific question (organization only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: integer
 *                 example: 5
 *               desc:
 *                 type: string
 *                 example: The total greenhouse gas emissions
 *     responses:
 *       201:
 *         description: Answer created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 */
router.post(
  "/questions/:id/answers",
  authMiddleware("org") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id_question = Number(req.params.id);
      const data: CreateAnswerDTO = req.body;
      const answer = await answerService.createAnswer(id_question, data);
      ResponseUtil.created(res, "Answer created successfully", answer);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /questions/{id}/answers:
 *   get:
 *     tags:
 *       - Answers
 *     summary: Get all answers for a question
 *     description: Retrieve all answers for a specific question
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Answers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/questions/:id/answers",
  authMiddleware() as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id_question = Number(req.params.id);
      const answers = await answerService.getAnswersByQuestionId(id_question);
      ResponseUtil.success(res, "Answers retrieved successfully", answers);
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
