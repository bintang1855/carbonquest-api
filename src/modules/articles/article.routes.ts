import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { AuthenticatedRequest, CreateArticleDTO } from "../../types/index.js";
import { ResponseUtil } from "../../utils/response.js";
import { ArticleService } from "./article.service.js";

const router = Router();
const articleService = new ArticleService();

/**
 * @openapi
 * /articles:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Create a new article
 *     description: Create a new article (organization only)
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
 *                 example: Climate Change and You
 *               content:
 *                 type: string
 *                 example: Understanding the impact of climate change...
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
  authMiddleware("org") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateArticleDTO = req.body;
      const article = await articleService.createArticle(data, req.user.sub);
      ResponseUtil.created(res, "Article created successfully", article);
    } catch (err) {
      next(err);
    }
  }) as any
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
  (async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const articles = await articleService.getAllArticles();
      ResponseUtil.success(res, "Articles retrieved successfully", articles);
    } catch (err) {
      next(err);
    }
  }) as any
);

export default router;
