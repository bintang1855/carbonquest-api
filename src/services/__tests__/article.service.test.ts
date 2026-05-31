import { ArticleService } from "../article.service.js";
import { ArticleRepository } from "../../repositories/article.repository.js";
import { AppError } from "../../middleware/error.middleware.js";

describe("ArticleService", () => {
  test("getAllArticles returns repository data", async () => {
    const repo = jest.spyOn(ArticleRepository.prototype, "findAll");
    repo.mockResolvedValue([{ id_article: 1 }] as any);

    const service = new ArticleService();
    const result = await service.getAllArticles();

    expect(result).toEqual([{ id_article: 1 }]);
  });

  test("getArticleById throws when missing", async () => {
    jest
      .spyOn(ArticleRepository.prototype, "findById")
      .mockResolvedValue(null as any);

    const service = new ArticleService();
    await expect(service.getArticleById(1)).rejects.toBeInstanceOf(AppError);
  });

  test("updateArticle calls repository update", async () => {
    jest
      .spyOn(ArticleRepository.prototype, "findById")
      .mockResolvedValue({ id_article: 1 } as any);
    const updateSpy = jest
      .spyOn(ArticleRepository.prototype, "update")
      .mockResolvedValue({ id_article: 1, title: "New" } as any);

    const service = new ArticleService();
    const result = await service.updateArticle(1, { title: "New" } as any);

    expect(updateSpy).toHaveBeenCalledWith(1, { title: "New" });
    expect(result.title).toBe("New");
  });

  test("deleteArticle calls repository delete", async () => {
    jest
      .spyOn(ArticleRepository.prototype, "findById")
      .mockResolvedValue({ id_article: 1 } as any);
    const deleteSpy = jest
      .spyOn(ArticleRepository.prototype, "delete")
      .mockResolvedValue(undefined as any);

    const service = new ArticleService();
    await service.deleteArticle(1);

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});
