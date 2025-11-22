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
}
