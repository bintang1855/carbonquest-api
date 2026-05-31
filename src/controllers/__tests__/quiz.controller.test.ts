import { QuizController } from "../quiz.controller.js";
import { QuizService } from "../../services/quiz.service.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

describe("QuizController", () => {
  test("createQuiz returns created", async () => {
    jest
      .spyOn(QuizService.prototype, "createQuiz")
      .mockResolvedValue({ id_quiz: 1 } as any);
    const controller = new QuizController();

    const req = { body: { title: "T" }, user: { sub: 1 } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.createQuiz(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("submitAnswer forwards errors", async () => {
    const error = new Error("bad");
    jest.spyOn(QuizService.prototype, "submitAnswer").mockRejectedValue(error);
    const controller = new QuizController();

    const req = {
      body: { id_answer: 1, id_question: 2 },
      user: { sub: 1 },
    } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.submitAnswer(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
