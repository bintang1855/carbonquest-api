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
    }) | null>;
    create(data: CreateArticleDTO & {
        id_author: number;
    }): Promise<ArticleDTO>;
    update(id: number, data: Partial<CreateArticleDTO>): Promise<ArticleDTO>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=article.repository.d.ts.map