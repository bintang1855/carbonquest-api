import { CreateArticleDTO } from "../../types/index.js";
import { ArticleRepository } from "./article.repository.js";

export class ArticleService {
  private repository: ArticleRepository;

  constructor() {
    this.repository = new ArticleRepository();
  }

  async getAllArticles() {
    return await this.repository.findAll();
  }

  async createArticle(data: CreateArticleDTO, authorId: number) {
    return await this.repository.create({
      ...data,
      id_author: authorId,
    });
  }

  async getArticleById(id: number) {
    const article = await this.repository.findById(id);
    if (!article) {
      throw new Error("Article not found");
    }
    return article;
  }

  async updateArticle(id: number, data: Partial<CreateArticleDTO>) {
    // Check if article exists
    await this.getArticleById(id);
    return await this.repository.update(id, data);
  }

  async deleteArticle(id: number) {
    // Check if article exists
    await this.getArticleById(id);
    await this.repository.delete(id);
  }
}
