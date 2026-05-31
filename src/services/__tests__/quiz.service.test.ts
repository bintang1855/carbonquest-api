import { QuizService } from "../quiz.service.js";
import { QuizRepository } from "../../repositories/quiz.repository.js";
import { SessionRepository } from "../../repositories/session.repository.js";
import { AppError } from "../../middleware/error.middleware.js";

describe("QuizService", () => {
  test("getAllQuizzes adds question_count", async () => {
    jest
      .spyOn(QuizRepository.prototype, "findAll")
      .mockResolvedValue([{ id_quiz: 1 }, { id_quiz: 2 }] as any);
    jest
      .spyOn(QuizRepository.prototype, "getQuestionCount")
      .mockImplementation(async (id) => (id === 1 ? 3 : 2));

    const service = new QuizService();
    const result = await service.getAllQuizzes();

    expect(result).toEqual([
      { id_quiz: 1, question_count: 3 },
      { id_quiz: 2, question_count: 2 },
    ]);
  });

  test("createQuiz uses createWithQuestions when questions exist", async () => {
    const createWithSpy = jest
      .spyOn(QuizRepository.prototype, "createWithQuestions")
      .mockResolvedValue({ id_quiz: 1 } as any);

    const service = new QuizService();
    await service.createQuiz(
      { title: "T", questions: [{ content: "Q", answers: [] }] } as any,
      10,
    );

    expect(createWithSpy).toHaveBeenCalled();
  });

  test("updateQuiz uses updateWithQuestions when questions exist", async () => {
    jest
      .spyOn(QuizRepository.prototype, "findById")
      .mockResolvedValue({ id_quiz: 1 } as any);
    const updateWithSpy = jest
      .spyOn(QuizRepository.prototype, "updateWithQuestions")
      .mockResolvedValue({ id_quiz: 1 } as any);

    const service = new QuizService();
    await service.updateQuiz(1, {
      title: "T",
      questions: [{ content: "Q", answers: [] }],
    } as any);

    expect(updateWithSpy).toHaveBeenCalledWith(1, {
      title: "T",
      questions: [{ content: "Q", answers: [] }],
    });
  });

  test("submitAnswer throws when answer missing", async () => {
    jest
      .spyOn(QuizRepository.prototype, "findAnswerById")
      .mockResolvedValue(null as any);

    const service = new QuizService();
    await expect(
      service.submitAnswer({ id_answer: 1, id_question: 2 } as any, 7),
    ).rejects.toBeInstanceOf(AppError);
  });

  test("submitAnswer throws when answer does not belong to question", async () => {
    jest
      .spyOn(QuizRepository.prototype, "findAnswerById")
      .mockResolvedValue({ id_answer: 1, id_question: 99 } as any);

    const service = new QuizService();
    await expect(
      service.submitAnswer({ id_answer: 1, id_question: 2 } as any, 7),
    ).rejects.toBeInstanceOf(AppError);
  });

  test("submitAnswer enforces daily limit", async () => {
    jest.spyOn(QuizRepository.prototype, "findAnswerById").mockResolvedValue({
      id_answer: 1,
      id_question: 2,
      points: 5,
      question: { id_quiz: 3, quiz: { category: "harian" } },
    } as any);
    jest
      .spyOn(SessionRepository.prototype, "hasAnsweredQuizQuestionInRange")
      .mockResolvedValue(true);

    const service = new QuizService();
    await expect(
      service.submitAnswer({ id_answer: 1, id_question: 2 } as any, 7),
    ).rejects.toBeInstanceOf(AppError);
  });

  test("submitAnswer creates session when allowed", async () => {
    jest.spyOn(QuizRepository.prototype, "findAnswerById").mockResolvedValue({
      id_answer: 1,
      id_question: 2,
      points: 10,
      question: { id_quiz: 3, quiz: { category: "harian" } },
    } as any);
    jest
      .spyOn(SessionRepository.prototype, "hasAnsweredQuizQuestionInRange")
      .mockResolvedValue(false);
    jest
      .spyOn(SessionRepository.prototype, "create")
      .mockResolvedValue({ id_session: 55 } as any);

    const service = new QuizService();
    const result = await service.submitAnswer(
      { id_answer: 1, id_question: 2 } as any,
      7,
    );

    expect(result).toEqual({ points_earned: 10, session_id: 55 });
  });
});
