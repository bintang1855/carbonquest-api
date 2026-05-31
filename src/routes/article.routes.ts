import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadLimiter } from "../middleware/rate-limit.middleware.js";
import { ArticleController } from "../controllers/article.controller.js";

const router = Router();
const controller = new ArticleController();

/**
 * @openapi
 * /articles:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Create a new article
 *     description: Create a new article with optional cover image (organization only)
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
 *                 example: Climate Change and You
 *               topic:
 *                 type: string
 *                 example: climate
 *               description:
 *                 type: string
 *                 example: Understanding the impact of climate change...
 *               content:
 *                 type: string
 *                 example: Full article content here...
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file
 *               photoCaption:
 *                 type: string
 *                 example: A view of melting glaciers
 *               photoCredit:
 *                 type: string
 *                 example: John Doe Photography
 *               authorName:
 *                 type: string
 *                 example: Jane Smith
 *               authorRole:
 *                 type: string
 *                 example: Editor
 *               place:
 *                 type: string
 *                 example: Bandung, Indonesia
 *               highlights:
 *                 type: string
 *                 example: Key points about climate action
 *     responses:
 *       201:
 *         description: Article created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 */
router.post(
  "/",
  uploadLimiter,
  authMiddleware("org") as any,
  upload.single("coverImage") as any,
  controller.createArticle as any
);

/**
 * @openapi
 * /articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get all articles
 *     description: Retrieve a list of all articles
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authMiddleware() as any,
  controller.getAllArticles as any
);

/**
 * @openapi
 * /articles/{id}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get article by ID
 *     description: Retrieve a single article by its ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
router.get(
  "/:id",
  authMiddleware() as any,
  controller.getArticleById as any
);

/**
 * @openapi
 * /articles/{id}:
 *   put:
 *     tags:
 *       - Articles
 *     summary: Update an article
 *     description: Update an existing article (organization only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               topic:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               photoCaption:
 *                 type: string
 *               photoCredit:
 *                 type: string
 *               authorName:
 *                 type: string
 *               authorRole:
 *                 type: string
 *               place:
 *                 type: string
 *               highlights:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 *       404:
 *         description: Article not found
 */
router.put(
  "/:id",
  uploadLimiter,
  authMiddleware("org") as any,
  upload.single("coverImage") as any,
  controller.updateArticle as any
);

/**
 * @openapi
 * /articles/{id}:
 *   delete:
 *     tags:
 *       - Articles
 *     summary: Delete an article
 *     description: Delete an existing article (organization only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization role required
 *       404:
 *         description: Article not found
 */
router.delete(
  "/:id",
  authMiddleware("org") as any,
  controller.deleteArticle as any
);

export default router;
