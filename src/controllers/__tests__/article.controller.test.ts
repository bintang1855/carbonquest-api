import { ArticleController } from "../article.controller.js";
import { ArticleService } from "../../services/article.service.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

describe("ArticleController", () => {
  test("createArticle calls service and returns created", async () => {
    const createSpy = jest
      .spyOn(ArticleService.prototype, "createArticle")
      .mockResolvedValue({ id_article: 1 } as any);
    const controller = new ArticleController();

    const req = {
      body: { title: "T", topic: "X" },
      file: { filename: "cover.png" },
      user: { sub: 9 },
    } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.createArticle(req, res, next);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "T",
        topic: "X",
        cover_image: "/files/cover.png",
      }),
      9,
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getAllArticles returns success", async () => {
    jest
      .spyOn(ArticleService.prototype, "getAllArticles")
      .mockResolvedValue([] as any);
    const controller = new ArticleController();

    const res = createMockResponse();
    const next = createMockNext();

    await controller.getAllArticles({} as any, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("deleteArticle forwards errors", async () => {
    const error = new Error("boom");
    jest
      .spyOn(ArticleService.prototype, "deleteArticle")
      .mockRejectedValue(error);
    const controller = new ArticleController();

    const req = { params: { id: "1" } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.deleteArticle(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
