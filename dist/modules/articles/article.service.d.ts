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
        topic: string | null;
        description: string | null;
        content: string | null;
        cover_image: string | null;
        photo_caption: string | null;
        photo_credit: string | null;
        author_name: string | null;
        author_role: string | null;
        place: string | null;
        highlights: string | null;
        date_created: Date | null;
        id_author: number;
    })[]>;
    createArticle(data: CreateArticleDTO, authorId: number): Promise<import("../../types/index.js").ArticleDTO>;
}
//# sourceMappingURL=article.service.d.ts.map