import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  AuthenticatedRequest,
  CreateQuizDTO,
  SubmitQuizAnswerDTO,
} from "../../types/index.js";
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
 *     description: Create a new quiz with questions and answers in one request (organization only)
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
 *                 example: Kuis Perubahan Iklim
 *               category:
 *                 type: string
 *                 example: Mingguan
 *               total_points:
 *                 type: integer
 *                 example: 100
 *               questions:
 *                 type: array
 *                 description: Optional - include questions and answers to create them together
 *                 items:
 *                   type: object
 *                   required:
 *                     - content
 *                     - answers
 *                   properties:
 *                     content:
 *                       type: string
 *                       example: Apa penyebab utama perubahan iklim?
 *                     points:
 *                       type: integer
 *                       example: 10
 *                     order:
 *                       type: integer
 *                       example: 1
 *                     answers:
 *                       type: array
 *                       minItems: 2
 *                       items:
 *                         type: object
 *                         required:
 *                           - content
 *                           - is_correct
 *                         properties:
 *                           content:
 *                             type: string
 *                             example: Emisi gas rumah kaca
 *                           is_correct:
 *                             type: boolean
 *                             example: true
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Quiz created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_quiz:
 *                       type: integer
 *                       example: 4
 *                     title:
 *                       type: string
 *                       example: Kuis Perubahan Iklim
 *                     category:
 *                       type: string
 *                       example: Mingguan
 *                     total_points:
 *                       type: integer
 *                       example: 100
 *                     id_creator:
 *                       type: integer
 *                       example: 1
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-15T10:24:21.678Z"
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_question:
 *                             type: integer
 *                             example: 4
 *                           id_quiz:
 *                             type: integer
 *                             example: 4
 *                           content:
 *                             type: string
 *                             example: Apa penyebab utama perubahan iklim?
 *                           points:
 *                             type: integer
 *                             example: 10
 *                           order:
 *                             type: integer
 *                             example: 1
 *                           answers:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id_answer:
 *                                   type: integer
 *                                   example: 10
 *                                 id_question:
 *                                   type: integer
 *                                   example: 4
 *                                 content:
 *                                   type: string
 *                                   example: Emisi gas rumah kaca
 *                                 is_correct:
 *                                   type: boolean
 *                                   example: true
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Quizzes retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_quiz:
 *                         type: integer
 *                         example: 4
 *                       title:
 *                         type: string
 *                         example: Kuis Perubahan Iklim
 *                       category:
 *                         type: string
 *                         example: Mingguan
 *                       total_points:
 *                         type: integer
 *                         example: 100
 *                       id_creator:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-15T10:24:21.678Z"
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id_organisasi:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: Green Corp
 *                           email:
 *                             type: string
 *                             example: info@greencorp.com
 *                           desc:
 *                             type: string
 *                             example: Environmental sustainability organization
 *                       questions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id_question:
 *                               type: integer
 *                               example: 4
 *                             id_quiz:
 *                               type: integer
 *                               example: 4
 *                             content:
 *                               type: string
 *                               example: Apa penyebab utama perubahan iklim?
 *                             points:
 *                               type: integer
 *                               example: 10
 *                             order:
 *                               type: integer
 *                               example: 1
 *                             answers:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id_answer:
 *                                     type: integer
 *                                     example: 10
 *                                   id_question:
 *                                     type: integer
 *                                     example: 4
 *                                   content:
 *                                     type: string
 *                                     example: Emisi gas rumah kaca
 *                                   is_correct:
 *                                     type: boolean
 *                                     example: true
 *                       question_count:
 *                         type: integer
 *                         example: 1
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
 *     summary: Update a quiz with questions
 *     description: Update an existing quiz including questions and answers (organization only)
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
 *                 example: "Updated Climate Quiz"
 *               category:
 *                 type: string
 *                 example: "Mingguan"
 *               total_points:
 *                 type: integer
 *                 example: 100
 *               questions:
 *                 type: array
 *                 description: Optional - include to update questions. Omit id_question to create new, include id_question to update existing
 *                 items:
 *                   type: object
 *                   required:
 *                     - content
 *                     - answers
 *                   properties:
 *                     id_question:
 *                       type: integer
 *                       description: Include to update existing question, omit to create new
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: "Updated: What is carbon footprint?"
 *                     points:
 *                       type: integer
 *                       example: 15
 *                     order:
 *                       type: integer
 *                       example: 1
 *                     answers:
 *                       type: array
 *                       minItems: 2
 *                       items:
 *                         type: object
 *                         required:
 *                           - content
 *                           - is_correct
 *                         properties:
 *                           id_answer:
 *                             type: integer
 *                             description: Include to update existing answer, omit to create new
 *                             example: 1
 *                           content:
 *                             type: string
 *                             example: "Updated answer content"
 *                           is_correct:
 *                             type: boolean
 *                             example: true
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
      const data = req.body;
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

/**
 * @openapi
 * /quizzes/submit-answer:
 *   post:
 *     tags:
 *       - Quizzes
 *     summary: Submit quiz answer
 *     description: Submit an answer to a quiz question. Backend automatically calculates score and creates session.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_question
 *               - id_answer
 *             properties:
 *               id_question:
 *                 type: integer
 *                 example: 1
 *                 description: The question being answered
 *               id_answer:
 *                 type: integer
 *                 example: 3
 *                 description: The answer chosen by the user
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Answer submitted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     is_correct:
 *                       type: boolean
 *                       example: true
 *                       description: Whether the answer is correct
 *                     points_earned:
 *                       type: integer
 *                       example: 10
 *                       description: Points earned from this answer
 *                     correct_answer:
 *                       type: string
 *                       example: Emisi gas rumah kaca
 *                       description: The correct answer (only shown if user answered wrong)
 *                     session_id:
 *                       type: integer
 *                       example: 1
 *                       description: ID of the created session
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.post(
  "/submit-answer",
  authMiddleware("user") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: SubmitQuizAnswerDTO = req.body;
      const result = await quizService.submitAnswer(data, req.user.sub);
      ResponseUtil.success(res, "Answer submitted successfully", result);
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
