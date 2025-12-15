import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import { uploadLimiter } from "../../middleware/rate-limit.middleware.js";
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
router.post("/", uploadLimiter, authMiddleware("org"), upload.single("coverImage"), (async (req, res, next) => {
    try {
        const data = {
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
            data.cover_image = `/files/${req.file.filename}`;
        }
        const article = await articleService.createArticle(data, req.user.sub);
        ResponseUtil.created(res, "Article created successfully", article);
    }
    catch (err) {
        next(err);
    }
}));
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
router.get("/", authMiddleware(), (async (_req, res, next) => {
    try {
        const articles = await articleService.getAllArticles();
        ResponseUtil.success(res, "Articles retrieved successfully", articles);
    }
    catch (err) {
        next(err);
    }
}));
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
router.get("/:id", authMiddleware(), (async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const article = await articleService.getArticleById(id);
        ResponseUtil.success(res, "Article retrieved successfully", article);
    }
    catch (err) {
        next(err);
    }
}));
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
router.put("/:id", uploadLimiter, authMiddleware("org"), upload.single("coverImage"), (async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = {
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
            data.cover_image = `/files/${req.file.filename}`;
        }
        // Remove undefined fields
        Object.keys(data).forEach((key) => data[key] === undefined &&
            delete data[key]);
        const article = await articleService.updateArticle(id, data);
        ResponseUtil.success(res, "Article updated successfully", article);
    }
    catch (err) {
        next(err);
    }
}));
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
router.delete("/:id", authMiddleware("org"), (async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await articleService.deleteArticle(id);
        ResponseUtil.success(res, "Article deleted successfully", null);
    }
    catch (err) {
        next(err);
    }
}));
export default router;
//# sourceMappingURL=article.routes.js.map