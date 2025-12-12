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
    async update(id, data) {
        return await prisma.articles.update({
            where: { id_article: id },
            data,
        });
    }
    async delete(id) {
        await prisma.articles.delete({
            where: { id_article: id },
        });
    }
}
//# sourceMappingURL=article.repository.js.map