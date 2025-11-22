import { ArticleDTO, CreateArticleDTO } from "../../types/index.js";
export declare class ArticleRepository {
    findAll(): Promise<({
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
    findById(id: number): Promise<({
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
    }) | null>;
    create(data: CreateArticleDTO & {
        id_author: number;
    }): Promise<ArticleDTO>;
}
//# sourceMappingURL=article.repository.d.ts.map