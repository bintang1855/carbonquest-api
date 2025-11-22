import { CreateArticleDTO } from "../../types/index.js";
export declare class ArticleService {
    private repository;
    constructor();
    getAllArticles(): Promise<({
        author: {
            id_organisasi: number;
            name: string;
            email: string;
            password: string;
            desc: string | null;
        };
    } & {
        id_article: number;
        title: string;
        content: string | null;
        date_created: Date | null;
        id_author: number;
    })[]>;
    createArticle(data: CreateArticleDTO, authorId: number): Promise<import("../../types/index.js").ArticleDTO>;
}
//# sourceMappingURL=article.service.d.ts.map