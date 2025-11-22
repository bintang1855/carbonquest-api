import prisma from "../../prisma/client.js";
import { ArticleDTO, CreateArticleDTO } from "../../types/index.js";

export class ArticleRepository {
  async findAll() {
    return await prisma.articles.findMany({
      include: { author: true },
    });
  }

  async findById(id: number) {
    return await prisma.articles.findUnique({
      where: { id_article: id },
      include: { author: true },
    });
  }

  async create(
    data: CreateArticleDTO & { id_author: number }
  ): Promise<ArticleDTO> {
    return await prisma.articles.create({
      data: {
        ...data,
        date_created: new Date(),
      },
    });
  }
}
