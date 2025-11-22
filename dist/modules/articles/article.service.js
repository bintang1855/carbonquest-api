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
}
//# sourceMappingURL=article.service.js.map