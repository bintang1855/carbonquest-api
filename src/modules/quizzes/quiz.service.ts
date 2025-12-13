import { CreateQuizDTO } from "../../types/index.js";
import { QuizRepository } from "./quiz.repository.js";

export class QuizService {
  private repository: QuizRepository;

  constructor() {
    this.repository = new QuizRepository();
  }

  async getAllQuizzes() {
    const quizzes = await this.repository.findAll();

    // Add question count to each quiz
    return await Promise.all(
      quizzes.map(async (quiz) => ({
        ...quiz,
        question_count: await this.repository.getQuestionCount(quiz.id_quiz),
      }))
    );
  }

  async getQuizById(id: number) {
    const quiz = await this.repository.findById(id);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    return quiz;
  }

  async createQuiz(data: CreateQuizDTO, creatorId: number) {
    return await this.repository.create({
      ...data,
      id_creator: creatorId,
    });
  }

  async updateQuiz(id: number, data: Partial<CreateQuizDTO>) {
    await this.getQuizById(id);
    return await this.repository.update(id, data);
  }

  async deleteQuiz(id: number) {
    await this.getQuizById(id);
    await this.repository.delete(id);
  }
}
