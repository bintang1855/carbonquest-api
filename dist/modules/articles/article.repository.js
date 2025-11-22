import prisma from "../../prisma/client.js";
export class ArticleRepository {
    async findAll() {
        return await prisma.articles.findMany({
            include: { author: true },
        });
    }
    async findById(id) {
        return await prisma.articles.findUnique({
            where: { id_article: id },
            include: { author: true },
        });
    }
    async create(data) {
        return await prisma.articles.create({
            data: {
                ...data,
                date_created: new Date(),
            },
        });
    }
}
//# sourceMappingURL=article.repository.js.map