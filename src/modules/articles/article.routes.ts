import { NextFunction, Response, Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
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
  authMiddleware("org") as any,
  upload.single("coverImage") as any,
  (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateArticleDTO = {
        title: req.body.title,
        topic: req.body.topic,
        description: req.body.description,
        content: req.body.content,
        photo_caption: req.body.photoCaption,
        photo_credit: req.body.photoCredit,
        author_name: req.body.authorName,
        author_role: req.body.authorRole,
        place: req.body.place,
        highlights: req.body.highlights,
      };

      // Add cover image URL if file was uploaded
      if (req.file) {
        data.cover_image = `/uploads/${req.file.filename}`;
      }

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
