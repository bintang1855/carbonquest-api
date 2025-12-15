import { ArticleRepository } from "./article.repository.js";
export class ArticleService {
    repository;
    constructor() {
        this.repository = new ArticleRepository();
    }
    async getAllArticles() {
        return await this.repository.findAll();
    }
    async createArticle(data, authorId) {
        return await this.repository.create({
            ...data,
            id_author: authorId,
        });
    }
    async getArticleById(id) {
        const article = await this.repository.findById(id);
        if (!article) {
            throw new Error("Article not found");
        }
        return article;
    }
    async updateArticle(id, data) {
        // Check if article exists
        await this.getArticleById(id);
        return await this.repository.update(id, data);
    }
    async deleteArticle(id) {
        // Check if article exists
        await this.getArticleById(id);
        await this.repository.delete(id);
    }
}
//# sourceMappingURL=article.service.js.map