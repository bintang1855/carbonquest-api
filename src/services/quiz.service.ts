import {
  CreateQuizDTO,
  UpdateQuizWithQuestionsDTO,
  SubmitQuizAnswerDTO,
  QuizSubmissionResultDTO,
} from "../types/index.js";
import { QuizRepository } from "../repositories/quiz.repository.js";
import { SessionRepository } from "../repositories/session.repository.js";
import { AppError } from "../middleware/error.middleware.js";

export class QuizService {
  private repository: QuizRepository;
  private sessionRepository: SessionRepository;

  constructor() {
    this.repository = new QuizRepository();
    this.sessionRepository = new SessionRepository();
  }

  async getAllQuizzes() {
    const quizzes = await this.repository.findAll();
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
      throw new AppError("Quiz not found", 404);
    }
    return quiz;
  }

  async createQuiz(data: CreateQuizDTO, creatorId: number) {
    const hasQuestions = data.questions && data.questions.length > 0;

    if (hasQuestions) {
      return await this.repository.createWithQuestions({ ...data, id_creator: creatorId });
    }

    return await this.repository.create({ ...data, id_creator: creatorId });
  }

  async updateQuiz(id: number, data: UpdateQuizWithQuestionsDTO) {
    await this.getQuizById(id);
    const hasQuestions = data.questions && data.questions.length > 0;

    if (hasQuestions) {
      return await this.repository.updateWithQuestions(id, data);
    }

    return await this.repository.update(id, data);
  }

  async deleteQuiz(id: number) {
    await this.getQuizById(id);
    await this.repository.delete(id);
  }

  async submitAnswer(data: SubmitQuizAnswerDTO, userId: number): Promise<QuizSubmissionResultDTO> {
    const answer = await this.repository.findAnswerById(data.id_answer);

    if (!answer) {
      throw new AppError("Answer not found", 404);
    }

    if (answer.id_question !== data.id_question) {
      throw new AppError("Answer does not belong to this question", 400);
    }

    const pointsEarned = answer.points || 0;
    const session = await this.createQuizSession(userId, data.id_answer, answer.question.id_quiz, pointsEarned);

    return {
      points_earned: pointsEarned,
      session_id: session.id_session,
    };
  }

  private async createQuizSession(
    userId: number,
    answerId: number,
    quizId: number,
    points: number
  ) {
    return await this.sessionRepository.create({
      id_user: userId,
      id_answer: answerId,
      id_quiz: quizId,
      session_type: "quiz",
      total_points: points,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
    });
  }

}
