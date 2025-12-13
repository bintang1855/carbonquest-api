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
 *             required:
 *               - content
 *               - is_correct
 *             properties:
 *               content:
 *                 type: string
 *                 example: Total greenhouse gas emissions caused by an individual
 *               is_correct:
 *                 type: boolean
 *                 example: true
 *                 description: Whether this is the correct answer
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

/**
 * @openapi
 * /answers/{id}:
 *   put:
 *     tags:
 *       - Answers
 *     summary: Update an answer
 *     description: Update an existing answer (organization only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Answer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: The amount of carbon dioxide released into the atmosphere
 *               is_correct:
 *                 type: boolean
 *                 example: false
 *                 description: Whether this is the correct answer
 *     responses:
 *       200:
 *         description: Answer updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 *       404:
 *         description: Answer not found
 */
router.put(
  "/answers/:id",
  authMiddleware("org") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const data: Partial<CreateAnswerDTO> = req.body;
      const answer = await answerService.updateAnswer(id, data);
      ResponseUtil.success(res, "Answer updated successfully", answer);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /answers/{id}:
 *   delete:
 *     tags:
 *       - Answers
 *     summary: Delete an answer
 *     description: Delete an existing answer (organization only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Answer ID
 *     responses:
 *       200:
 *         description: Answer deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 *       404:
 *         description: Answer not found
 */
router.delete(
  "/answers/:id",
  authMiddleware("org") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await answerService.deleteAnswer(id);
      ResponseUtil.success(res, "Answer deleted successfully", null);
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
