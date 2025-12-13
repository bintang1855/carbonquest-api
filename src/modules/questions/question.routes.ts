import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { AuthenticatedRequest, CreateQuestionDTO } from "../../types/index.js";
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
 *             required:
 *               - id_quiz
 *               - content
 *             properties:
 *               id_quiz:
 *                 type: integer
 *                 example: 1
 *                 description: The quiz ID this question belongs to
 *               content:
 *                 type: string
 *                 example: What is carbon footprint?
 *               points:
 *                 type: integer
 *                 example: 10
 *               order:
 *                 type: integer
 *                 example: 1
 *                 description: Order of the question in the quiz
 *     responses:
 *       201:
 *         description: Question created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 */
router.post(
  "/",
  authMiddleware("org") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateQuestionDTO = req.body;
      const question = await questionService.createQuestion(data);
      ResponseUtil.created(res, "Question created successfully", question);
    } catch (err) {
      next(err);
    }
  }) as any
);

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
router.get(
  "/",
  authMiddleware() as any,
  (async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const questions = await questionService.getAllQuestions();
      ResponseUtil.success(res, "Questions retrieved successfully", questions);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /questions/{id}:
 *   get:
 *     tags:
 *       - Questions
 *     summary: Get question by ID
 *     description: Retrieve a single question with its answers
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
 *         description: Question retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */
router.get(
  "/:id",
  authMiddleware() as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const question = await questionService.getQuestionById(id);
      ResponseUtil.success(res, "Question retrieved successfully", question);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /questions/{id}:
 *   put:
 *     tags:
 *       - Questions
 *     summary: Update a question
 *     description: Update an existing question (organization only)
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
 *                 example: 15
 *               content:
 *                 type: string
 *                 example: What is greenhouse effect?
 *               category:
 *                 type: string
 *                 example: Climate
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 *       404:
 *         description: Question not found
 */
router.put(
  "/:id",
  authMiddleware("org") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data: Partial<CreateQuestionDTO> = req.body;
      const question = await questionService.updateQuestion(id, data);
      ResponseUtil.success(res, "Question updated successfully", question);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /questions/{id}:
 *   delete:
 *     tags:
 *       - Questions
 *     summary: Delete a question
 *     description: Delete an existing question (organization only)
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
 *         description: Question deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 *       404:
 *         description: Question not found
 */
router.delete(
  "/:id",
  authMiddleware("org") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await questionService.deleteQuestion(id);
      ResponseUtil.success(res, "Question deleted successfully", null);
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
