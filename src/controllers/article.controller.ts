import { NextFunction, Response } from "express";
import { AuthenticatedRequest, CreateArticleDTO } from "../types/index.js";
import { ResponseUtil } from "../utils/response.js";
import { ArticleService } from "../services/article.service.js";

export class ArticleController {
  private service: ArticleService;

  constructor() {
    this.service = new ArticleService();
  }

  /**
   * Create a new article
   */
  public createArticle = async (
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
        data.cover_image = `/files/${req.file.filename}`;
      }

      const article = await this.service.createArticle(data, req.user.sub);
      ResponseUtil.created(res, "Article created successfully", article);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get all articles
   */
  public getAllArticles = async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const articles = await this.service.getAllArticles();
      ResponseUtil.success(res, "Articles retrieved successfully", articles);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get article by ID
   */
  public getArticleById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const article = await this.service.getArticleById(id);
      ResponseUtil.success(res, "Article retrieved successfully", article);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update an article
   */
  public updateArticle = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data: Partial<CreateArticleDTO> = {
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
      Object.keys(data).forEach(
        (key) =>
          data[key as keyof typeof data] === undefined &&
          delete data[key as keyof typeof data]
      );

      const article = await this.service.updateArticle(id, data);
      ResponseUtil.success(res, "Article updated successfully", article);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Delete an article
   */
  public deleteArticle = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteArticle(id);
      ResponseUtil.success(res, "Article deleted successfully", null);
    } catch (err) {
      next(err);
    }
  };
}
