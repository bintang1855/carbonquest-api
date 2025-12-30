import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { QuizController } from "../controllers/quiz.controller.js";

const router = Router();
const controller = new QuizController();

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
 *                         properties:
 *                           content:
 *                             type: string
 *                             example: Emisi gas rumah kaca
 *                           points:
 *                             type: integer
 *                             example: 10
 *                             description: Point value for this answer (default 0)
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
  controller.createQuiz as any
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
  controller.getAllQuizzes as any
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
  controller.getQuizById as any
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
 *               category:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_question:
 *                       type: integer
 *                     content:
 *                       type: string
 *                     order:
 *                       type: integer
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_answer:
 *                             type: integer
 *                           content:
 *                             type: string
 *                           points:
 *                             type: integer
 *                             description: Point value for this answer
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       404:
 *         description: Quiz not found
 */
router.put(
  "/:id",
  authMiddleware("org") as any,
  controller.updateQuiz as any
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
  controller.deleteQuiz as any
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
 *               id_answer:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user role required
 */
router.post(
  "/submit-answer",
  authMiddleware("user") as any,
  controller.submitAnswer as any
);

export default router;
