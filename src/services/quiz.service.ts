import {
  CreateQuizDTO,
  UpdateQuizWithQuestionsDTO,
  SubmitQuizAnswerDTO,
  QuizSubmissionResultDTO,
} from "../types/index.js";
import { QuizRepository } from "../repositories/quiz.repository.js";
import { SessionRepository } from "../repositories/session.repository.js";

export class QuizService {
  private repository: QuizRepository;
  private sessionRepository: SessionRepository;

  constructor() {
    this.repository = new QuizRepository();
    this.sessionRepository = new SessionRepository();
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
    // If questions are provided, create quiz with nested questions & answers
    if (data.questions && data.questions.length > 0) {
      return await this.repository.createWithQuestions({
        ...data,
        id_creator: creatorId,
      });
    }

    // Otherwise create quiz only
    return await this.repository.create({
      ...data,
      id_creator: creatorId,
    });
  }

  async updateQuiz(id: number, data: UpdateQuizWithQuestionsDTO) {
    await this.getQuizById(id);

    // If questions are provided, update quiz with nested questions & answers
    if (data.questions && data.questions.length > 0) {
      return await this.repository.updateWithQuestions(id, data);
    }

    // Otherwise update quiz metadata only
    return await this.repository.update(id, data);
  }

  async deleteQuiz(id: number) {
    await this.getQuizById(id);
    await this.repository.delete(id);
  }

  async submitAnswer(
    data: SubmitQuizAnswerDTO,
    userId: number
  ): Promise<QuizSubmissionResultDTO> {
    // Get answer with question details
    const answer = await this.repository.findAnswerById(data.id_answer);

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Check if answer belongs to the question
    if (answer.id_question !== data.id_question) {
      throw new Error("Answer does not belong to this question");
    }

    // Calculate points
    const pointsEarned = answer.is_correct ? answer.question.points || 0 : 0;

    // Get quiz ID from question
    const quizId = answer.question.id_quiz;

    // Create session automatically
    const session = await this.sessionRepository.create({
      id_user: userId,
      id_answer: data.id_answer,
      id_quiz: quizId,
      session_type: "quiz",
      total_points: pointsEarned,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
    });

    // Get correct answer if user answered wrong
    let correctAnswer: string | undefined;
    if (!answer.is_correct) {
      const correct = answer.question.answers.find((a) => a.is_correct);
      correctAnswer = correct?.content;
    }

    return {
      is_correct: answer.is_correct,
      points_earned: pointsEarned,
      correct_answer: correctAnswer,
      session_id: session.id_session,
    };
  }
}
