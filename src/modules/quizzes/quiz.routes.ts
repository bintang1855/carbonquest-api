import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { AuthenticatedRequest, CreateQuizDTO } from "../../types/index.js";
import { ResponseUtil } from "../../utils/response.js";
import { QuizService } from "./quiz.service.js";

const router = Router();
const quizService = new QuizService();

/**
 * @openapi
 * /quizzes:
 *   post:
 *     tags:
 *       - Quizzes
 *     summary: Create a new quiz
 *     description: Create a new quiz topic (organization only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Kuis Harian
 *               category:
 *                 type: string
 *                 example: Harian
 *               total_points:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Quiz created successfully
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
      const data: CreateQuizDTO = req.body;
      const quiz = await quizService.createQuiz(data, req.user.sub);
      ResponseUtil.created(res, "Quiz created successfully", quiz);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /quizzes:
 *   get:
 *     tags:
 *       - Quizzes
 *     summary: Get all quizzes
 *     description: Retrieve a list of all quizzes with question counts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Quizzes retrieved successfully
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
      const quizzes = await quizService.getAllQuizzes();
      ResponseUtil.success(res, "Quizzes retrieved successfully", quizzes);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /quizzes/{id}:
 *   get:
 *     tags:
 *       - Quizzes
 *     summary: Get quiz by ID
 *     description: Retrieve a single quiz with all questions and answers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz retrieved successfully
 *       404:
 *         description: Quiz not found
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
      const quiz = await quizService.getQuizById(id);
      ResponseUtil.success(res, "Quiz retrieved successfully", quiz);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /quizzes/{id}:
 *   put:
 *     tags:
 *       - Quizzes
 *     summary: Update a quiz
 *     description: Update an existing quiz (organization only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               total_points:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       404:
 *         description: Quiz not found
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
      const data: Partial<CreateQuizDTO> = req.body;
      const quiz = await quizService.updateQuiz(id, data);
      ResponseUtil.success(res, "Quiz updated successfully", quiz);
    } catch (err) {
      next(err);
    }
  }) as any
);

/**
 * @openapi
 * /quizzes/{id}:
 *   delete:
 *     tags:
 *       - Quizzes
 *     summary: Delete a quiz
 *     description: Delete an existing quiz (organization only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
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
      await quizService.deleteQuiz(id);
      ResponseUtil.success(res, "Quiz deleted successfully", null);
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
